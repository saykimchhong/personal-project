#include <WiFi.h>
#include <FirebaseESP32.h>
#include <DHT.h>
#include <Wire.h>
#include <BH1750.h>
#include <TimeLib.h>
const int timeZoneOffset = 7; // UTC+7 for Thailand

const char* ssid = "Kim";
const char* password = "123456789";

#define FIREBASE_HOST "https://iot01-17127-default-rtdb.asia-southeast1.firebasedatabase.app/"
#define FIREBASE_AUTH "AIzaSyChrXLebnWYPh0GkYCWTRAMEfe2hfHAZ0c"

FirebaseData firebaseData;
DHT dht(5, DHT22);
BH1750 lightSensor;

int relay01_pin = 17;
int relay02_pin = 18;
int relay_pump_pin = 19;
int ledConnect_onBoard = 25;
int ledDisConnect_onBoard = 32;
int ledConnect_Front = 16;
int Buzzer = 2;

unsigned long lastReadTime = 0;
unsigned long lastSendTime = 0;
const unsigned long readInterval = 100;
const unsigned long sendInterval = 5000;
//const unsigned long boardStatusUpdateInterval = 15000;

void setup() {
  pinMode(relay01_pin, OUTPUT);
  pinMode(relay02_pin, OUTPUT);
  pinMode(relay_pump_pin, OUTPUT);
  dht.begin();
  Wire.begin();
  lightSensor.begin(BH1750::CONTINUOUS_HIGH_RES_MODE);

  pinMode(ledConnect_onBoard, OUTPUT);
  pinMode(ledDisConnect_onBoard, OUTPUT);
  pinMode(ledConnect_Front, OUTPUT);
  pinMode(Buzzer, OUTPUT);

  WIFI_Connect();
  digitalWrite(Buzzer, HIGH);
  delay(300);
  digitalWrite(Buzzer, LOW);

  Serial.begin(9600);
    // Set the initial time (replace with the current time in your timezone)
  setTime(2, 37, 0, 20, 07, 2023);
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
}

void WIFI_Connect() {
  digitalWrite(ledDisConnect_onBoard, HIGH);
  digitalWrite(ledConnect_onBoard, LOW);
  digitalWrite(ledConnect_Front, LOW);

  WiFi.disconnect();
  Serial.println("Booting Sketch...");
  WiFi.mode(WIFI_OFF);
  delay(1000);
  WiFi.mode(WIFI_AP_STA);
  WiFi.begin(ssid, password);

  for (int i = 0; i < 10; i++) {
    if (WiFi.status() != WL_CONNECTED) {
      delay(250);
      digitalWrite(ledDisConnect_onBoard, LOW);
      digitalWrite(ledConnect_onBoard, LOW);
      digitalWrite(ledConnect_Front, LOW);
      Serial.print(".");
      delay(250);
      digitalWrite(ledDisConnect_onBoard, HIGH);
      digitalWrite(ledConnect_onBoard, LOW);
      delay(250);
      Serial.println("Device is Active!");
    }
  }
  digitalWrite(ledDisConnect_onBoard, LOW);
  digitalWrite(ledConnect_onBoard, HIGH);
  digitalWrite(ledConnect_Front, HIGH);
}

void sendDataToFirebase(const char* type, float value) {
  String dir = "/sensors/" + String(type);
  if (Firebase.setFloat(firebaseData, dir, value)) {
    Serial.println(String(type) + " = " + String(value) + " sent to Firebase successfully");
  } else {
    Serial.println("Failed to send data to Firebase");
    Serial.println(firebaseData.errorReason());
  }
}

int getRelayState(String RelayNo) {
  String dir = "/Relays/" + RelayNo;
  if (Firebase.getString(firebaseData, dir)) {
    int value = atoi(firebaseData.stringData().c_str());
    return value;
  } else {
    Serial.println("Failed to read data from Firebase");
    Serial.println(firebaseData.errorReason());
    return 0;
  }
}

void updateEsp32Status() {
unsigned long currentMillis = millis();
  Firebase.setDouble(firebaseData, "/devices/esp32/status", currentMillis);
}

void loop() {
  unsigned long currentMillis = millis();

  // Read data from Firebase every 100 milliseconds
  if (currentMillis - lastReadTime >= readInterval) {
    int Relay01State = getRelayState("Relay01");
    int Relay02State = getRelayState("Relay02");
    int RelayPumpState = getRelayState("RelayPump");
    digitalWrite(relay01_pin, Relay01State);
    digitalWrite(relay02_pin, Relay02State);
    digitalWrite(relay_pump_pin, RelayPumpState);
    lastReadTime = currentMillis;
  }

  // Send data to Firebase every 5 seconds
  if (currentMillis - lastSendTime >= sendInterval) {
    float temperature = dht.readTemperature();
    float humidity = dht.readHumidity();
    //uint16_t lux = lightSensor.readLightLevel();
    uint16_t lux = random(0, 1000);

    if (!isnan(temperature) && !isnan(humidity)) {
      sendDataToFirebase("temperature", temperature);
      sendDataToFirebase("humidity", humidity);
      sendDataToFirebase("light", static_cast<float>(lux));
      updateEsp32Status();
    } else {
      Serial.println("Failed to read data from DHT or BH1750 sensor!");
    }
    lastSendTime = currentMillis;
  }

  // Update ESP32 status in Firebase every 15 seconds
//  if (currentMillis - lastSendTime >= boardStatusUpdateInterval) {
//    updateEsp32Status();
//    lastSendTime = currentMillis;
//  }

  // Check WiFi status and reconnect if necessary
  if (WiFi.status() != WL_CONNECTED) {
    digitalWrite(ledConnect_onBoard, LOW);
    Serial.println("Device Disconnected!");
    ESP.restart();
    WIFI_Connect();
  } else if (WiFi.status() == WL_CONNECTED) {
    digitalWrite(ledConnect_onBoard, HIGH);
    digitalWrite(ledConnect_Front, HIGH);
    Serial.println("Device is Active!");
  } else {
    Serial.println("ESP Restart...");
    ESP.restart();
  }
}
