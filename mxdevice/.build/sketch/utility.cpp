// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. 

#include "HTS221Sensor.h"
#include "AzureIotHub.h"
#include "Arduino.h"
#include "parson.h"
#include <assert.h>
#include "config.h"
#include "RGB_LED.h"
#include "Sensor.h"
#include "LIS2MDLSensor.h"

#define RGB_LED_BRIGHTNESS 32

DevI2C *i2c;
HTS221Sensor *ht_sensor;
LPS22HBSensor *pressureSensor;
LSM6DSLSensor *acc_gyro;
LIS2MDLSensor *lis2mdl;

int gAxes[3];
int mAxes[3];

static RGB_LED rgbLed;
static int interval = INTERVAL;

int getInterval()
{
    return interval;
}

void blinkLED()
{
    rgbLed.turnOff();
    rgbLed.setColor(RGB_LED_BRIGHTNESS, 0, 0);
    delay(500);
    rgbLed.turnOff();
}

void blinkSendConfirmation()
{
    rgbLed.turnOff();
    rgbLed.setColor(0, 0, RGB_LED_BRIGHTNESS);
    delay(500);
    rgbLed.turnOff();
}

void parseTwinMessage(DEVICE_TWIN_UPDATE_STATE updateState, const char *message)
{
    JSON_Value *root_value;
    root_value = json_parse_string(message);
    if (json_value_get_type(root_value) != JSONObject)
    {
        if (root_value != NULL)
        {
            json_value_free(root_value);
        }
        LogError("parse %s failed", message);
        return;
    }
    JSON_Object *root_object = json_value_get_object(root_value);

    double val = 0;
    if (updateState == DEVICE_TWIN_UPDATE_COMPLETE)
    {
        JSON_Object *desired_object = json_object_get_object(root_object, "desired");
        if (desired_object != NULL)
        {
            val = json_object_get_number(desired_object, "interval");
        }
    }
    else
    {
        val = json_object_get_number(root_object, "interval");
    }
    if (val > 500)
    {
        interval = (int)val;
        LogInfo(">>>Device twin updated: set interval to %d", interval);
    }
    json_value_free(root_value);
}

void SensorInit()
{
    i2c = new DevI2C(D14, D15);

    ht_sensor = new HTS221Sensor(*i2c);
    ht_sensor->init(NULL);

    pressureSensor = new LPS22HBSensor(*i2c);
    pressureSensor -> init(NULL);

    acc_gyro = new LSM6DSLSensor(*i2c, D4, D5);
    acc_gyro->init(NULL);
    acc_gyro->enableAccelerator();

    lis2mdl = new LIS2MDLSensor(*i2c);
    lis2mdl->init(NULL);
}

float readTemperature()
{
    ht_sensor->reset();

    float temperature = 0;
    ht_sensor->getTemperature(&temperature);

    return temperature;
}

float readHumidity()
{
    ht_sensor->reset();

    float humidity = 0;
    ht_sensor->getHumidity(&humidity);

    return humidity;
}

float readPressure()
{
    float pressure = 0;
    pressureSensor -> getPressure(&pressure);

    return pressure;
}

void setAccelAxes() {
    acc_gyro->getXAxes(gAxes);
}

void setMagAxes() {
    lis2mdl->getMAxes(mAxes);
}

float * setMessage(int messageId, char *payload, bool soundRecorded)
{
    static float newValues[3];

    JSON_Value *root_value = json_value_init_object();
    JSON_Object *root_object = json_value_get_object(root_value);
    char *serialized_string = NULL;

    json_object_set_number(root_object, "messageId", messageId);
    json_object_set_boolean(root_object, "soundRecorded", soundRecorded);

    //obtain values
    float temperature = readTemperature() * 1.8 + 32; // convert to F
    float humidity = readHumidity();
    float pressure = readPressure();
    setAccelAxes();
    setMagAxes();

    //setNewValues
    newValues[0] = temperature;
    newValues[1] = humidity;
    newValues[2] = pressure;
    
    bool temperatureAlert = false;

    //set temp json
    if(temperature != temperature)
    {
        json_object_set_null(root_object, "temperature");
    }
    else
    {
        json_object_set_number(root_object, "temperature", temperature);
    }

    //set humidity json
    if(humidity != humidity)
    {
        json_object_set_null(root_object, "humidity");
    }
    else
    {
        json_object_set_number(root_object, "humidity", humidity);
    }

    //set pressure json
    if(pressure != pressure)
    {
        json_object_set_null(root_object, "pressure");
    }
    else
    {
        json_object_set_number(root_object, "pressure", pressure);
    }


    //set gyro axes
    json_object_set_number(root_object, "accelX", gAxes[0]);
    json_object_set_number(root_object, "accelY", gAxes[1]);
    json_object_set_number(root_object, "accelZ", gAxes[2]);
    
    //set mag axes
    json_object_set_number(root_object, "magX", mAxes[0]);
    json_object_set_number(root_object, "magY", mAxes[1]);
    json_object_set_number(root_object, "magZ", mAxes[2]);

    serialized_string = json_serialize_to_string_pretty(root_value);

    snprintf(payload, MESSAGE_MAX_LEN, "%s", serialized_string);
    json_free_serialized_string(serialized_string);
    json_value_free(root_value);

    return newValues;
}