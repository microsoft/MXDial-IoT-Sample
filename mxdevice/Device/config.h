// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. 

// Interval time(ms) for sending message to IoT Hub
#define INTERVAL 2000

#define MESSAGE_MAX_LEN 256

#define TEMPERATURE_ALERT 30

#define DIRECT_METHOD_NAME "message"

#define DEVICE_CREDENTIAL_ENDPOINT "<Web App URL>/api/mx/device-credentials/" //NOTE: You will need to update this to like the following: https://mxchip-<your initials>.azurewebsites.net/api/mx/device-credentials/

#define DEVICE_CREDENTIAL_ENDPOINT_AUTH "Basic dDpBenVyZQ==" //NOTE: If you updated your password in your web.config - you will have to convert your password to Base64

// How many messages get sent to the hub before user has to press A to continue
#define MESSAGE_SEND_COUNT_LIMIT 350