/* =====================================================================
   GAFAS DETECTORAS DE OBSTÁCULOS - versión ULTRASONIDO (HC-SR04)
   Placa:   ESP32-C3 Super Mini
   Sensor:  HC-SR04 (ultrasonido)
   Aviso:   2 motores vibradores tipo moneda, en paralelo, por un BD139
   Control: sensor táctil TTP223 (un toque = encender / apagar)
   Energía: LiPo 3,7 V 300 mAh -> TP4056 (carga) -> MT3608 (5 V)

   FUNCIONAMIENTO
   ---------------------------------------------------------------------
   - Al arrancar queda APAGADO (no vibra). Un toque en el TTP223 lo
     enciende: 2 pulsos cortos de confirmación. Otro toque lo apaga:
     1 pulso largo.
   - Encendido, mide cada 60 ms. Cuanto más cerca el obstáculo, más
     rápido y más fuerte vibra:
        > 150 cm         -> sin vibración
        150 .. 30 cm     -> pulsos cada vez más rápidos
        < 30 cm          -> vibración continua (peligro)
   - Usa la mediana de 3 lecturas para filtrar ecos falsos.

   CONEXIONES (ESP32-C3 Super Mini)
   ---------------------------------------------------------------------
   GPIO4  <- OUT del TTP223            (VCC 3V3, GND)
   GPIO1  -> TRIG del HC-SR04          (3,3 V alcanza para disparar)
   GPIO3  <- ECHO del HC-SR04  ¡¡CON DIVISOR!!  ECHO sale a 5 V:
                ECHO --[1 kΩ]--+-- GPIO3
                               |
                             [2 kΩ]
                               |
                              GND
   GPIO10 -> [1 kΩ] -> BASE del BD139
            BD139: EMISOR a GND, COLECTOR al (-) de los 2 motores.
            (+) de los motores a 5 V (salida MT3608).
            Diodo 1N4148 / 1N4007 en antiparalelo con los motores
            (cátodo a 5 V) para proteger el transistor.
   HC-SR04 VCC -> 5 V (MT3608)     GND común a todo.
   ESP32 5V    -> 5 V (MT3608)

   NO USAR GPIO2, GPIO8 NI GPIO9 (strapping pins: impiden arrancar).
   BD139 pinout (cara con texto al frente): E - C - B.

   Arduino IDE: placa "ESP32C3 Dev Module", USB CDC On Boot: Enabled.
   Core ESP32 3.x (usa ledcAttach). No requiere librerías externas.
   ===================================================================== */

// ---------- PINES -----------------------------------------------------
#define PIN_TACTIL   4
#define PIN_TRIG     1
#define PIN_ECHO     3
#define PIN_MOTOR    10

// ---------- AJUSTES ---------------------------------------------------
#define DIST_MAX_CM        150   // más lejos que esto: no avisa
#define DIST_PELIGRO_CM    30    // más cerca: vibración continua
#define INTERVALO_MED_MS   60    // HC-SR04 necesita >= 60 ms entre disparos
#define TIMEOUT_ECHO_US    25000 // ~4 m; si no vuelve el eco: "nada"
#define PWM_FREQ           1000
#define PWM_RES            8     // 0..255
#define PWM_MIN            140   // potencia mínima que mueve los motores
#define PWM_MAX            255
#define DEBOUNCE_MS        50

// ---------- ESTADO ----------------------------------------------------
bool  encendido      = false;
float distanciaCm    = -1;     // -1 = sin obstáculo
unsigned long tUltMedicion = 0;

// ---------- MOTOR -----------------------------------------------------
void motor(uint8_t potencia) { ledcWrite(PIN_MOTOR, potencia); }

void pulso(uint16_t ms, uint8_t n = 1) {          // confirmaciones
  for (uint8_t i = 0; i < n; i++) {
    motor(PWM_MAX); delay(ms);
    motor(0);       delay(120);
  }
}

// ---------- SENSOR ----------------------------------------------------
float medirUnaVez() {
  digitalWrite(PIN_TRIG, LOW);  delayMicroseconds(2);
  digitalWrite(PIN_TRIG, HIGH); delayMicroseconds(10);
  digitalWrite(PIN_TRIG, LOW);
  unsigned long us = pulseIn(PIN_ECHO, HIGH, TIMEOUT_ECHO_US);
  if (us == 0) return -1;                  // sin eco
  return us * 0.0343f / 2.0f;              // cm
}

float medirFiltrado() {                     // mediana de 3
  float a = medirUnaVez(); delay(10);
  float b = medirUnaVez(); delay(10);
  float c = medirUnaVez();
  // "sin eco" = muy lejos
  if (a < 0) a = 9999; if (b < 0) b = 9999; if (c < 0) c = 9999;
  float m = max(min(a, b), min(max(a, b), c));
  return (m >= 9999) ? -1 : m;
}

// ---------- TÁCTIL (detecta flanco de subida) -------------------------
bool toqueNuevo() {
  static bool ultimo = LOW;
  static unsigned long tCambio = 0;
  bool actual = digitalRead(PIN_TACTIL);
  if (actual != ultimo && millis() - tCambio > DEBOUNCE_MS) {
    tCambio = millis();
    ultimo  = actual;
    return actual == HIGH;
  }
  return false;
}

// ---------- PATRÓN DE VIBRACIÓN (no bloqueante) -----------------------
void actualizarVibracion() {
  static unsigned long tCiclo = 0;

  if (!encendido || distanciaCm < 0 || distanciaCm > DIST_MAX_CM) {
    motor(0);
    return;
  }
  if (distanciaCm <= DIST_PELIGRO_CM) {      // peligro: continuo
    motor(PWM_MAX);
    return;
  }
  // Entre peligro y máximo: periodo de 100 ms (cerca) a 800 ms (lejos)
  float t = (distanciaCm - DIST_PELIGRO_CM) / (float)(DIST_MAX_CM - DIST_PELIGRO_CM);
  unsigned long periodo   = 100 + t * 700;
  unsigned long encendMs  = 80;
  uint8_t potencia = PWM_MAX - t * (PWM_MAX - PWM_MIN);

  unsigned long fase = (millis() - tCiclo) % periodo;
  motor(fase < encendMs ? potencia : 0);
}

// ---------- SETUP / LOOP ----------------------------------------------
void setup() {
  Serial.begin(115200);
  pinMode(PIN_TACTIL, INPUT);
  pinMode(PIN_TRIG, OUTPUT);
  pinMode(PIN_ECHO, INPUT);
  digitalWrite(PIN_TRIG, LOW);

  ledcAttach(PIN_MOTOR, PWM_FREQ, PWM_RES);
  motor(0);

  Serial.println("Gafas ultrasonido listas. Toque para encender.");
}

void loop() {
  if (toqueNuevo()) {
    encendido = !encendido;
    motor(0);
    if (encendido) pulso(100, 2);   // 2 cortos = encendido
    else           pulso(400, 1);   // 1 largo  = apagado
    Serial.println(encendido ? "ENCENDIDO" : "APAGADO");
  }

  if (encendido && millis() - tUltMedicion >= INTERVALO_MED_MS) {
    tUltMedicion = millis();
    distanciaCm = medirFiltrado();
    Serial.print("Distancia: ");
    if (distanciaCm < 0) Serial.println("sin obstáculo");
    else { Serial.print(distanciaCm, 1); Serial.println(" cm"); }
  }

  actualizarVibracion();
}
