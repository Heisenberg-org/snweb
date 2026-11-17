/* =====================================================================
   ANTEOJOS DETECTORES DE OBSTÁCULOS  -  v2 (con modo diagnóstico)
   Nodo Escuela Reynaldo Merín - Proyecto 2
   Conectados por Mendoza Futura - Episodio 3, Estación 3

   Placa:   ESP32-C3 Super Mini
   Sensor:  VL53L0X (distancia por tiempo de vuelo)
   Aviso:   motor de vibración por transistor BC548
   Control: sensor táctil TTP223

   FUNCIONAMIENTO NORMAL (igual que la versión anterior)
   -----------------------------------------------------------------
   - Se enciende manteniendo tocado el táctil 1,5 segundos.
   - Se apaga con doble toque rápido (menos de 500 ms entre toques).
   - Con el sistema encendido, mide distancia cada 500 ms.
   - Si hay un obstáculo a 200 mm o menos, vibra.

   NUEVO: MODO DIAGNÓSTICO
   -----------------------------------------------------------------
   Para calibrar en clase sin cable, las gafas pueden crear su propia
   red Wi-Fi y publicar lo que están midiendo.

   Cómo se entra:  mantener el táctil apretado MIENTRAS se enciende la
                   placa, y sostenerlo 3 segundos.
   Cómo se confirma: el motor da 3 pulsos cortos.
   Cómo se sale:   apagar y volver a encender sin tocar nada.

   POR QUÉ NO QUEDA SIEMPRE PRENDIDO
   -----------------------------------------------------------------
   El Wi-Fi del ESP32-C3 consume del orden de 80 a 100 mA. Con la
   batería Li-Po de 300 mAh, la autonomía cae de varias horas a menos
   de tres. En un dispositivo que una persona usa puesto, eso no es un
   detalle: es la diferencia entre servir y no servir. Por eso el modo
   diagnóstico es para la mesa de trabajo, no para el uso real.

   PINES (ESP32-C3 Super Mini)
   -----------------------------------------------------------------
   GPIO3   -> señal del sensor táctil TTP223
   GPIO10  -> base del BC548 (motor de vibración)
   GPIO4   -> SDA del VL53L0X
   GPIO5   -> SCL del VL53L0X

   NO USAR GPIO2, GPIO8 NI GPIO9. Son strapping pins: la placa los lee
   al arrancar para decidir el modo de boot. Si quedan ocupados, la
   placa entra en bucle de reinicio. Ya nos pasó y nos costó una clase.

   LIBRERÍA A INSTALAR
   -----------------------------------------------------------------
   - Adafruit_VL53L0X   (Gestor de librerías del Arduino IDE)
   Wire.h, WiFi.h y WebServer.h ya vienen en el core ESP32.
   ===================================================================== */

// ---------- CONFIGURACIÓN --------------------------------------------
#define UMBRAL_INICIAL_MM   200     // distancia a la que empieza a vibrar
#define INTERVALO_SENSOR_MS 500     // cada cuánto se mide
#define MS_PULSACION_LARGA  1500    // encendido: toque sostenido
#define MS_DOBLE_TOQUE      500     // apagado: dos toques dentro de esto
#define MS_ENTRAR_DIAG      3000    // táctil sostenido al arrancar

#define AP_SSID             "Gafas-Merin"
#define AP_PASS             "vibra2026"

// ---------- PINES ---------------------------------------------------
#define PIN_TACTIL          3       // antes GPIO2: era strapping pin
#define PIN_MOTOR           10      // antes GPIO9: era el botón BOOT
#define PIN_SDA             4
#define PIN_SCL             5

// ---------- LIBRERÍAS ------------------------------------------------
#include <Wire.h>
#include <Adafruit_VL53L0X.h>
#include <WiFi.h>
#include <WebServer.h>

Adafruit_VL53L0X lox;
WebServer servidor(80);

// ---------- ESTADO GLOBAL --------------------------------------------
bool sistemaEncendido = false;
bool modoDiagnostico  = false;
bool sensorOK         = false;
bool vibrando         = false;

int  distanciaMM  = -1;             // -1 = sin medición válida
int  umbralMM     = UMBRAL_INICIAL_MM;
uint32_t lecturasOK    = 0;
uint32_t lecturasFuera = 0;

// Detección de la pulsación larga de encendido
bool     contando     = false;
uint32_t tiempoInicio = 0;

// Detección del doble toque de apagado
bool     estadoAnterior = LOW;
uint32_t ultimoToque    = 0;
int      cantidadToques = 0;

uint32_t tiempoSensor = 0;
uint32_t tiempoReintento = 0;

// =====================================================================
//  SETUP
// =====================================================================
void setup() {
  Serial.begin(115200);
  delay(300);

  pinMode(PIN_TACTIL, INPUT);
  pinMode(PIN_MOTOR, OUTPUT);
  digitalWrite(PIN_MOTOR, LOW);     // motor apagado al arrancar

  Serial.println();
  Serial.println(F("=== Anteojos detectores de obstáculos - Nodo Merín ==="));

  // I2C en pines seguros (no strapping): SDA=GPIO4, SCL=GPIO5
  Wire.begin(PIN_SDA, PIN_SCL);
  iniciarSensor();

  // Se revisa el táctil ANTES de arrancar el funcionamiento normal.
  detectarModoDiagnostico();

  if (modoDiagnostico) {
    iniciarWiFiDiagnostico();
    sistemaEncendido = true;        // en diagnóstico arranca midiendo
  }

  Serial.println(F("ms,distancia_mm,vibrando,umbral_mm,estado"));
}

// =====================================================================
//  LOOP
// =====================================================================
void loop() {
  if (modoDiagnostico) {
    servidor.handleClient();
  }

  // Si el sensor no arrancó, se reintenta cada 2 segundos en lugar de
  // quedarse trabado para siempre: un dispositivo que alguien usa
  // puesto no puede morir en silencio por un cable flojo.
  if (!sensorOK && millis() - tiempoReintento > 2000) {
    tiempoReintento = millis();
    iniciarSensor();
  }

  leerTactil();

  if (sistemaEncendido && sensorOK &&
      millis() - tiempoSensor >= INTERVALO_SENSOR_MS) {
    tiempoSensor = millis();
    medirYAvisar();
    imprimirCSV();
  }

  if (!sistemaEncendido && vibrando) {
    apagarMotor();
  }
}

// =====================================================================
//  SENSOR Y MOTOR
// =====================================================================
void iniciarSensor() {
  if (lox.begin()) {
    sensorOK = true;
    Serial.println(F("[OK] VL53L0X listo"));
  } else {
    sensorOK = false;
    Serial.println(F("[ERROR] No se encontró el VL53L0X. Revisar SDA=4, SCL=5 y 3V3."));
  }
}

void medirYAvisar() {
  VL53L0X_RangingMeasurementData_t medida;
  lox.rangingTest(&medida, false);

  if (medida.RangeStatus != 4) {          // 4 = fuera de rango
    distanciaMM = medida.RangeMilliMeter;
    lecturasOK++;

    if (distanciaMM <= umbralMM) {
      encenderMotor();
    } else {
      apagarMotor();
    }
  } else {
    distanciaMM = -1;
    lecturasFuera++;
    apagarMotor();
  }
}

void encenderMotor() {
  digitalWrite(PIN_MOTOR, HIGH);
  vibrando = true;
}

void apagarMotor() {
  digitalWrite(PIN_MOTOR, LOW);
  vibrando = false;
}

// Pulsos cortos, para confirmar algo al tacto sin depender de la vista.
void pulsosMotor(int cantidad, int duracion) {
  for (int i = 0; i < cantidad; i++) {
    digitalWrite(PIN_MOTOR, HIGH);
    delay(duracion);
    digitalWrite(PIN_MOTOR, LOW);
    delay(duracion);
  }
}

// =====================================================================
//  SENSOR TÁCTIL: ENCENDIDO Y APAGADO
// =====================================================================
void leerTactil() {
  bool estado = digitalRead(PIN_TACTIL);

  // --- Encendido: toque sostenido 1,5 segundos ---
  if (estado == HIGH && !sistemaEncendido) {
    if (!contando) {
      contando = true;
      tiempoInicio = millis();
    } else if (millis() - tiempoInicio >= MS_PULSACION_LARGA) {
      sistemaEncendido = true;
      contando = false;
      Serial.println(F("# sistema ENCENDIDO"));
      pulsosMotor(1, 200);
    }
  }
  if (estado == LOW) {
    contando = false;
  }

  // --- Apagado: dos toques rápidos ---
  if (estado == HIGH && estadoAnterior == LOW && sistemaEncendido) {
    uint32_t ahora = millis();
    if (ahora - ultimoToque < MS_DOBLE_TOQUE) {
      cantidadToques++;
      if (cantidadToques >= 2) {
        sistemaEncendido = false;
        cantidadToques = 0;
        apagarMotor();
        Serial.println(F("# sistema APAGADO"));
        pulsosMotor(2, 120);
      }
    } else {
      cantidadToques = 1;
    }
    ultimoToque = ahora;
  }

  estadoAnterior = estado;
}

/* Se llama una sola vez, en el arranque. Si el táctil no está tocado,
   sale enseguida y no demora el encendido normal. Si está tocado,
   espera a ver si lo sostienen los 3 segundos. */
void detectarModoDiagnostico() {
  if (digitalRead(PIN_TACTIL) != HIGH) return;

  Serial.println(F("Táctil tocado al arrancar: sostener 3 s para modo diagnóstico..."));
  uint32_t inicio = millis();

  while (digitalRead(PIN_TACTIL) == HIGH) {
    if (millis() - inicio >= MS_ENTRAR_DIAG) {
      modoDiagnostico = true;
      Serial.println(F("[OK] MODO DIAGNÓSTICO activado"));
      pulsosMotor(3, 150);          // confirmación al tacto
      return;
    }
    delay(20);
  }
  Serial.println(F("Se soltó antes de los 3 s: arranque normal."));
}

// =====================================================================
//  MODO DIAGNÓSTICO: RED Y SERVIDOR
// =====================================================================
void iniciarWiFiDiagnostico() {
  WiFi.mode(WIFI_AP);
  bool ok = WiFi.softAP(AP_SSID, AP_PASS, 1, 0, 4);
  delay(300);

  if (ok) {
    Serial.println(F("[OK] Punto de acceso creado"));
    Serial.print(F("     Red:     ")); Serial.println(AP_SSID);
    Serial.print(F("     Clave:   ")); Serial.println(AP_PASS);
    Serial.print(F("     Panel:   http://")); Serial.println(WiFi.softAPIP());
    Serial.println(F("     RECORDAR: el Wi-Fi consume batería. Solo para calibrar."));
  } else {
    Serial.println(F("[ERROR] No se pudo crear el punto de acceso"));
  }

  servidor.on("/",      manejarRaiz);
  servidor.on("/datos", manejarDatos);
  servidor.on("/cmd",   manejarComando);
  servidor.begin();
}

String estadoTexto() {
  if (!sensorOK)         return "SIN SENSOR";
  if (!sistemaEncendido) return "APAGADO";
  if (vibrando)          return "OBSTACULO";
  if (distanciaMM < 0)   return "FUERA DE RANGO";
  return "LIBRE";
}

void imprimirCSV() {
  Serial.print(millis());        Serial.print(',');
  Serial.print(distanciaMM);     Serial.print(',');
  Serial.print(vibrando ? 1 : 0); Serial.print(',');
  Serial.print(umbralMM);        Serial.print(',');
  Serial.println(estadoTexto());
}

void manejarDatos() {
  String j = "{";
  j += "\"distancia_mm\":" + String(distanciaMM);
  j += ",\"umbral_mm\":"   + String(umbralMM);
  j += ",\"vibrando\":"    + String(vibrando ? 1 : 0);
  j += ",\"vibra\":\""     + String(vibrando ? "SI" : "NO") + "\"";
  j += ",\"encendido\":"   + String(sistemaEncendido ? 1 : 0);
  j += ",\"lecturas_ok\":" + String(lecturasOK);
  j += ",\"fuera_rango\":" + String(lecturasFuera);
  j += ",\"uptime_s\":"    + String(millis() / 1000);
  j += ",\"estado\":\""    + estadoTexto() + "\"";
  j += "}";
  servidor.send(200, "application/json", j);
}

/* Comandos para calibrar desde el panel, sin volver a compilar.
   Cambiar el umbral y sentir la diferencia en el momento es mucho más
   didáctico que editar un número y esperar a que suba el sketch. */
void manejarComando() {
  String a = servidor.hasArg("a") ? servidor.arg("a") : "";

  if      (a == "umbral_mas")  { umbralMM += 50; if (umbralMM > 1200) umbralMM = 1200; }
  else if (a == "umbral_menos"){ umbralMM -= 50; if (umbralMM < 50)   umbralMM = 50; }
  else if (a == "umbral") {
    // Valor exacto, para el deslizador del panel: /cmd?a=umbral&v=350
    if (servidor.hasArg("v")) {
      umbralMM = constrain(servidor.arg("v").toInt(), 50, 1200);
    }
  }
  else if (a == "encender")    { sistemaEncendido = true;  pulsosMotor(1, 200); }
  else if (a == "apagar")      { sistemaEncendido = false; apagarMotor(); pulsosMotor(2, 120); }
  else if (a == "prueba")      { pulsosMotor(3, 200); }
  else {
    servidor.send(400, "text/plain", "comando desconocido");
    return;
  }

  Serial.print(F("# comando: ")); Serial.print(a);
  Serial.print(F(" | umbral = ")); Serial.println(umbralMM);
  servidor.send(200, "text/plain", "ok");
}

void manejarRaiz() {
  static const char PAGINA[] PROGMEM = R"HTML(
<!DOCTYPE html><html lang="es"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Gafas Merín - diagnóstico</title>
<style>
body{font-family:system-ui,sans-serif;margin:0;padding:22px;background:#1b1233;color:#f2f0ff}
h1{font-size:19px;margin:0 0 2px}p.s{margin:0 0 18px;color:#b3a8d8;font-size:13px}
.est{padding:16px;border-radius:10px;text-align:center;font-size:20px;font-weight:700;background:#2a1d4d;border:1px solid #4a3a7a}
.g{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:10px;margin:16px 0}
.c{background:#2a1d4d;border:1px solid #4a3a7a;border-radius:10px;padding:12px}
.r{font-size:11px;color:#b3a8d8;text-transform:uppercase}
.v{font-size:24px;font-weight:600;margin-top:4px}
button{font-family:inherit;font-size:14px;padding:11px;border-radius:8px;border:1px solid #4a3a7a;background:#2a1d4d;color:#f2f0ff;flex:1;min-width:110px}
.f{display:flex;gap:8px;flex-wrap:wrap}
.av{margin-top:18px;font-size:12px;color:#efa927;text-align:center}
</style></head><body>
<h1>Gafas detectoras de obstáculos</h1>
<p class="s">Nodo Reynaldo Merín &middot; modo diagnóstico</p>
<div class="est" id="e">--</div>
<div class="g">
  <div class="c"><div class="r">Distancia</div><div class="v" id="d">--</div></div>
  <div class="c"><div class="r">Umbral</div><div class="v" id="u">--</div></div>
  <div class="c"><div class="r">Vibrando</div><div class="v" id="v">--</div></div>
  <div class="c"><div class="r">Encendido</div><div class="v" id="o">--</div></div>
</div>
<div class="f">
  <button onclick="c('umbral_menos')">Umbral −50</button>
  <button onclick="c('umbral_mas')">Umbral +50</button>
  <button onclick="c('prueba')">Probar motor</button>
  <button onclick="c('encender')">Encender</button>
  <button onclick="c('apagar')">Apagar</button>
</div>
<p class="av">El Wi-Fi consume batería: usalo solo para calibrar.</p>
<script>
async function c(a){ await fetch("/cmd?a="+a); r(); }
async function r(){
  try{
    const d=await (await fetch("/datos")).json();
    document.getElementById("e").textContent=d.estado;
    document.getElementById("d").textContent=(d.distancia_mm<0?"--":d.distancia_mm+" mm");
    document.getElementById("u").textContent=d.umbral_mm+" mm";
    document.getElementById("v").textContent=d.vibra;
    document.getElementById("o").textContent=d.encendido?"SI":"NO";
  }catch(e){}
}
r();setInterval(r,1000);
</script></body></html>
)HTML";
  servidor.send_P(200, "text/html", PAGINA);
}

/* =====================================================================
   CALIBRAR EL UMBRAL CON LOS CHICOS

   1. Entrar en modo diagnóstico y abrir el panel.
   2. Poner un obstáculo a una distancia conocida, medida con centímetro.
   3. Comparar con lo que dice el panel. El VL53L0X es bastante exacto
      en interiores, pero pierde precisión con superficies negras,
      espejadas o transparentes: vale la pena probar con un vidrio y
      con una remera negra para que vean la limitación real.
   4. Bajar y subir el umbral desde el panel mientras alguien tiene las
      gafas puestas y camina. La pregunta a responder no es "¿cuál es
      el número correcto?" sino "¿a cuántos pasos de distancia necesita
      el aviso una persona que camina normal?".

   Ojo con una cosa importante para el pitch: el VL53L0X mide en un cono
   angosto, así que detecta lo que está justo al frente. No reemplaza al
   bastón, que barre el piso. Es un complemento, y decirlo así es más
   sólido que prometer que resuelve todo.
   ===================================================================== */
