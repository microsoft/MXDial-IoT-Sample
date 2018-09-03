'use strict';var _fsPlus = require('fs-plus');var _fsPlus2 = _interopRequireDefault(_fsPlus);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

var ConnectionString = require('azure-iot-common').ConnectionString;
var connectionString = "HostName=andy0414-iothub-510a.azure-devices.net;DeviceId=AZ3166;SharedAccessKey=2BpyLsT+/cet74wRsL/fVHpxSWfrrQue42LWYHtvJG8=";
var anHourFromNow = require('azure-iot-common').anHourFromNow;
var SharedAccessSignature = require('azure-iot-device/lib/shared_access_signature.js');
var cn = ConnectionString.parse(connectionString);
console.log(cn.HostName, cn.DeviceId, cn.SharedAccessKey);
var sas = SharedAccessSignature.create(cn.HostName, cn.DeviceId, cn.SharedAccessKey, 1492333149);
console.log(sas.toString());

// andy0414-iothub-510a.azure-devices.net/devices/AZ3166

//SharedAccessSignature sr=sechs-iothub-3a3c.azure-devices.net/devices/AZ3166&sig=wQ5LDglT8TsBFTouCBjZaPvU0YV39CvrPxov3kFN5mU%3D&skn=testname&se=1492333149
//SharedAccessSignature sr=sechs-iothub-3a3c.azure-devices.net/devices/AZ3166&sig=wQ5LDglT8TsBFTouCBjZaPvU0YV39CvrPxov3kFN5mU%3d&se=1492333149&skn=testname
// //
// // // // use factory function from AMQP-specific package
// var clientFromConnectionString = require('azure-iot-device-http').clientFromConnectionString;
//
// // AMQP-specific factory function returns Client object from core package
// var client = clientFromConnectionString(connectionString);
//
// // use Message object from core package
// var Message = require('azure-iot-device').Message;
//
// var connectCallback = function (err) {
//     if (err) {
//         console.error('Could not connect: ' + err);
//     } else {
//         console.log('Client connected');
//         client.uploadToBlob('HelloWorld.wav', fs.createReadStream('c:/work/NEWS'), 10, (e, r) => {
//             console.log(e, r);
//         });
//
//     };
// };
//
//
// client.open(connectCallback);