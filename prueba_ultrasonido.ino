// PRUEBA 1: solo HC-SR04. Imprime la distancia cada 200 ms.
// TRIG -> GPIO1 | ECHO -> divisor 1k/2k -> GPIO3 | VCC -> 5V | GND -> G
#define PIN_TRIG 1
#define PIN_ECHO 3

void setup() {
  Serial.begin(115200);
  pinMode(PIN_TRIG, OUTPUT);
  pinMode(PIN_ECHO, INPUT);
  digitalWrite(PIN_TRIG, LOW);
}

void loop() {
  digitalWrite(PIN_TRIG, HIGH); delayMicroseconds(10);
  digitalWrite(PIN_TRIG, LOW);
  unsigned long us = pulseIn(PIN_ECHO, HIGH, 25000);
  if (us == 0) Serial.println("Sin eco (nada cerca, o revisar cables)");
  else { Serial.print("Distancia: "); Serial.print(us * 0.0343f / 2, 1); Serial.println(" cm"); }
  delay(200);
}
