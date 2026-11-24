// PRUEBA 2: TTP223 + HC-SR04.
// TTP223: VCC->3V3, GND->G, I/O->GPIO4 | HC-SR04: TRIG->GPIO1, ECHO->divisor->GPIO3
// Cada toque alterna ENCENDIDO/APAGADO; encendido muestra la distancia.
#define PIN_TACTIL 4
#define PIN_TRIG   1
#define PIN_ECHO   3

bool encendido = false, ultimo = LOW;
unsigned long tCambio = 0, tMed = 0, tLat = 0;

void setup() {
  Serial.begin(115200);
  pinMode(PIN_TACTIL, INPUT);
  pinMode(PIN_TRIG, OUTPUT);
  pinMode(PIN_ECHO, INPUT);
  digitalWrite(PIN_TRIG, LOW);
}

void loop() {
  bool actual = digitalRead(PIN_TACTIL);
  if (millis() - tLat > 1000) { tLat = millis(); Serial.print("[estado pin tactil: "); Serial.print(actual ? "ALTO" : "BAJO"); Serial.println("]"); }
  if (actual != ultimo && millis() - tCambio > 50) {
    tCambio = millis(); ultimo = actual;
    Serial.println(actual ? ">> TOQUE (pin en ALTO)" : ">> solto (pin en BAJO)");
    if (actual) {
      encendido = !encendido;
      Serial.println(encendido ? "=== ENCENDIDO ===" : "=== APAGADO ===");
    }
  }
  if (encendido && millis() - tMed > 300) {
    tMed = millis();
    digitalWrite(PIN_TRIG, HIGH); delayMicroseconds(10); digitalWrite(PIN_TRIG, LOW);
    unsigned long us = pulseIn(PIN_ECHO, HIGH, 25000);
    if (us == 0) Serial.println("  sin eco");
    else { Serial.print("  Distancia: "); Serial.print(us * 0.0343f / 2, 1); Serial.println(" cm"); }
  }
}
