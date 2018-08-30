// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. 

// Interval time(ms) for sending message to IoT Hub
#define INTERVAL 2000

#define MESSAGE_MAX_LEN 256

#define DEVICE_ID "AZ3166" // this gets overwritten by custom code - leaving here so scripts compile

#define TEMPERATURE_ALERT 30

#define DIRECT_METHOD_NAME "message"

#define DEVICE_CREDENTIAL_ENDPOINT "https://azureiothubmx.azurewebsites.net/api/mx/GetDeviceCredentials?deviceId="

#define DEVICE_CREDENTIAL_ENDPOINT_AUTH "Basic dDpBenVyZQ=="

// how many messages get sent to the hub before user has to press A to continue
#define MESSAGE_SEND_COUNT_LIMIT 350