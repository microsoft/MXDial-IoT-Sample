// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. 
// To get started please visit https://microsoft.github.io/azure-iot-developer-kit/docs/projects/connect-iot-hub?utm_source=ArduinoExtension&utm_medium=ReleaseNote&utm_campaign=VSCode
#include "AZ3166WiFi.h"
#include "AzureIotHub.h"
#include "DevKitMQTTClient.h"
#include "config.h"
#include "utility.h"
#include "SystemTickCounter.h"
#include "RingBuffer.h"
#include "parson.h"
#include "EEPROMInterface.h"
#include "http_client.h"


static bool hasWifi = false;
int messageCount = 0; // holds ID
int messageSendCounter = 0; // holds how many send in session (can be reset)
static bool messageSending = true;
static bool soundRecorded = false;
static uint64_t send_interval_ms;
bool messageReceived = false;
static char *iothub_hostname = NULL;
const char *device_conn_string = NULL;
char device_id[6];

//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Utilities
static void InitWifi()
{
  Screen.print(2, "Connecting...");
  
  if (WiFi.begin() == WL_CONNECTED)
  {
    IPAddress ip = WiFi.localIP();
    Screen.print(1, ip.get_address());
    hasWifi = true;
    Screen.print(2, "Running... \r\n");
  }
  else
  {
    hasWifi = false;
    Screen.print(1, "No Wi-Fi\r\n ");
  }
}

static void SendConfirmationCallback(IOTHUB_CLIENT_CONFIRMATION_RESULT result)
{
  if (result == IOTHUB_CLIENT_CONFIRMATION_OK)
  {
    blinkSendConfirmation();
  }
}

static void MessageCallback(const char* payLoad, int size)
{
  blinkLED();
  Screen.print(1, payLoad, true);
}

static void DeviceTwinCallback(DEVICE_TWIN_UPDATE_STATE updateState, const unsigned char *payLoad, int size)
{
  char *temp = (char *)malloc(size + 1);
  if (temp == NULL)
  {
    return;
  }
  memcpy(temp, payLoad, size);
  temp[size] = '\0';
  parseTwinMessage(updateState, temp);
  free(temp);
}

static int  DeviceMethodCallback(const char *methodName, const unsigned char *payload, int size, unsigned char **response, int *response_size)
{
  LogInfo("Try to invoke method %s", methodName);
  const char *responseMessage = "\"Successfully invoke device method\"";
  int result = 200;
  
  if (strcmp(methodName, DIRECT_METHOD_NAME) == 0)
  {
    messageReceived = true;

    char *temp = (char *)malloc(size + 1);
    memcpy(temp, payload, size);
    temp[size] = '\0';

    if(temp != NULL){
      Screen.init();
      Screen.print(0, "NEW MESSAGE!");
      Screen.print(2, temp);
    }
    free(temp);
  }
  else
  {
    LogInfo("No method %s found", methodName);
    responseMessage = "\"No method found\"";
    result = 404;
  }

  *response_size = strlen(responseMessage);
  *response = (unsigned char *)malloc(*response_size);
  strncpy((char *)(*response), responseMessage, *response_size);

  return result;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Arduino sketch
void setup()
{
  Screen.init();
  Screen.print(0, "IoT Device Demo");
  Screen.print(2, "Initializing...");
  
  Screen.print(3, " > Serial");
  Serial.begin(115200);

  // Initialize the WiFi module
  Screen.print(3, " > WiFi");
  hasWifi = false;
  InitWifi();
  if (!hasWifi)
  {
    return;
  }
  
  //Get MAC address and populate device id
  byte mac[6];
  WiFi.macAddress(mac);
  sprintf(device_id, "%02x%02x%02x" , mac[3], mac[4], mac[5]);
  
  //http call to device endpoint
  char endpoint[100];
  sprintf(endpoint, "%s%s" ,DEVICE_CREDENTIAL_ENDPOINT, device_id);
  Serial.println(endpoint);
  //http call to device endpoint
  HTTPClient client = HTTPClient(HTTP_GET, endpoint);
  client.set_header("Authorization", DEVICE_CREDENTIAL_ENDPOINT_AUTH);
  const Http_Response *response = client.send(NULL, 0);
  
  if (response != NULL)
  {
      const char *message = response->body;

      JSON_Value *root_value = json_parse_string(message);
      JSON_Object *root_object = json_value_get_object(root_value);\
      device_conn_string = json_object_get_string(root_object, "ConnectionString");
      Serial.println("Get HTTP succeeded");
      Serial.println(device_conn_string);
  }
  else
  {
      Serial.println("Get HTTP response failed.");
      return;
  }

  //write device connection in eeprom
  EEPROMInterface eeprom;
  uint8_t *connString = (uint8_t *) device_conn_string;
  int resp = eeprom.write(connString, AZ_IOT_HUB_MAX_LEN, AZ_IOT_HUB_ZONE_IDX);
  if (resp == 0)
  {
      Serial.println("Successfull wrote device connection string to eeprom");
  }
  else if (resp == 0)
  {
      Serial.println("Error writing device connection string to eeprom.");
      return;
  }
  
  Screen.print(3, " > Sensors");
  SensorInit();

  Screen.print(3, " > IoT Hub");
  DevKitMQTTClient_Init(true);

  DevKitMQTTClient_SetOption(OPTION_MINI_SOLUTION_NAME, "MXDeviceDemo");
  DevKitMQTTClient_SetSendConfirmationCallback(SendConfirmationCallback);
  DevKitMQTTClient_SetMessageCallback(MessageCallback);
  DevKitMQTTClient_SetDeviceTwinCallback(DeviceTwinCallback);
  DevKitMQTTClient_SetDeviceMethodCallback(DeviceMethodCallback);

  send_interval_ms = SystemTickCounterRead();
}

void loop()
{
  if (hasWifi)
  {
    if (messageSending && 
        (int)(SystemTickCounterRead() - send_interval_ms) >= getInterval())
    {
      if(MESSAGE_SEND_COUNT_LIMIT == NULL || messageSendCounter <= MESSAGE_SEND_COUNT_LIMIT) {
        
        //check if user want to record - this is temp until we get the sound working properly
        if (digitalRead(USER_BUTTON_B) == LOW && messageReceived == false)
        {
          Screen.clean();
          Screen.print(1, "Start recording");
          do{
            //nothing - just imitate recording
          } while (digitalRead(USER_BUTTON_B) == LOW);      
          soundRecorded = true;   
        }

        // Send data
        char messagePayload[MESSAGE_MAX_LEN];
        float *newValues;

        newValues = setMessage(messageCount++, messagePayload, soundRecorded);

        if(!messageReceived) {
          //update display
          char buff[128];
          sprintf(buff, "ID: %s \r\n Temp:%sF    \r\n Humidity:%s%% \r\n Pres:%smb         \r\n" ,device_id , f2s(*(newValues), 1), f2s(*(newValues + 1), 1), f2s(*(newValues + 2), 1));
          Screen.print(buff);
          
        }

        EVENT_INSTANCE* message = DevKitMQTTClient_Event_Generate(messagePayload, MESSAGE);
        DevKitMQTTClient_SendEventInstance(message);

        messageSendCounter ++;

      } else if (messageSendCounter > MESSAGE_SEND_COUNT_LIMIT && digitalRead(USER_BUTTON_A) == LOW) {
        Screen.clean();
        messageSendCounter = 0;
      } else {
        Screen.clean();
        Screen.print(1, "Hold A to send");
        Screen.print(2, "data to the IoT");
        Screen.print(3, "Hub...");
      }
      send_interval_ms = SystemTickCounterRead();
    }
    else
    {
      DevKitMQTTClient_Check();
    }

    //reset display after message
    if (digitalRead(USER_BUTTON_A) == LOW && messageReceived == true)
    {
      //set flag so data shows on display
      messageReceived = false;
    }

    // reset mock audio
    if(soundRecorded == true) {
      soundRecorded = false;
    }
  }
  delay(10);
}

