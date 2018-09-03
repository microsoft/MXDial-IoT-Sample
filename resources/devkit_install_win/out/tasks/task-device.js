'use strict';var _regenerator = require('babel-runtime/regenerator');var _regenerator2 = _interopRequireDefault(_regenerator);var _stringify = require('babel-runtime/core-js/json/stringify');var _stringify2 = _interopRequireDefault(_stringify);var _extends2 = require('babel-runtime/helpers/extends');var _extends3 = _interopRequireDefault(_extends2);var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);var _fsPlus = require('fs-plus');var _fsPlus2 = _interopRequireDefault(_fsPlus);
var _path = require('path');var _path2 = _interopRequireDefault(_path);
var _azurecli = require('../azurecli');var _azurecli2 = _interopRequireDefault(_azurecli);
var _lodash = require('lodash');var _lodash2 = _interopRequireDefault(_lodash);
var _telemetry = require('../telemetry');var telemetry = _interopRequireWildcard(_telemetry);function _interopRequireWildcard(obj) {if (obj && obj.__esModule) {return obj;} else {var newObj = {};if (obj != null) {for (var key in obj) {if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];}}newObj.default = obj;return newObj;}}function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

var DEVICE_ID = 'AZ3166';

exports.default = {
    name: "provision iothub device",
    run: function () {var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(context) {var deviceId, configFile, azureCliLocation, azurecli, iotHubName, deviceList, device1, createDeviceRes, result, deviceResult;return _regenerator2.default.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:
                            deviceId = void 0;
                            configFile = _path2.default.join(context.arduino_project.rootFolder, '.bin', 'config.json');
                            if (_fsPlus2.default.existsSync(configFile)) {
                                deviceId = require(configFile).device || DEVICE_ID;
                            }
                            azureCliLocation = context.azureCliLocation;
                            azurecli = new _azurecli2.default(azureCliLocation);
                            iotHubName = context.iotHubName;_context.next = 8;return (
                                azurecli.execResultJson('iot device list --hub-name ' + iotHubName + ' --top 1000'));case 8:deviceList = _context.sent;
                            device1 = _lodash2.default.find(deviceList, { "deviceId": deviceId });if (!(
                            device1 && device1.status !== 'enabled')) {_context.next = 16;break;}
                            console.log('enable ' + device1.deviceId);_context.next = 14;return (
                                azurecli.execNoOutput('iot device update --hub-name ' + iotHubName + ' --device-id ' + deviceId + ' --set status=enabled'));case 14:_context.next = 20;break;case 16:if (
                            device1) {_context.next = 20;break;}_context.next = 19;return (
                                azurecli.execResultJson('iot device create --hub-name ' + iotHubName + ' --device-id ' + deviceId));case 19:createDeviceRes = _context.sent;case 20:_context.next = 22;return (

                                azurecli.execResultJson('iot device show-connection-string --hub-name ' + iotHubName + ' --device-id ' + deviceId + ' --key secondary'));case 22:result = _context.sent;

                            context.output = context.output || {};if (

                            result.connectionString) {_context.next = 28;break;}_context.next = 27;return (
                                telemetry.trace('Task provision iothub device failed.', context.iotHubName));case 27:throw (
                                new Error('Cannot get device connection string.'));case 28:


                            deviceResult = {
                                deviceConnectionString: result.connectionString,
                                deviceId: deviceId };

                            telemetry.trace('Task provision iothub device succeeded.', context.iotHubName);
                            context.output = (0, _extends3.default)({}, context.output, deviceResult);return _context.abrupt('return',
                            (0, _stringify2.default)(deviceResult));case 32:case 'end':return _context.stop();}}}, _callee, undefined);}));return function run(_x) {return _ref.apply(this, arguments);};}() };