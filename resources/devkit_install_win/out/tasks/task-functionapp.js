'use strict';var _regenerator = require('babel-runtime/regenerator');var _regenerator2 = _interopRequireDefault(_regenerator);var _extends2 = require('babel-runtime/helpers/extends');var _extends3 = _interopRequireDefault(_extends2);var _stringify = require('babel-runtime/core-js/json/stringify');var _stringify2 = _interopRequireDefault(_stringify);var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);var _v = require('uuid/v4');var _v2 = _interopRequireDefault(_v);
var _path = require('path');var _path2 = _interopRequireDefault(_path);
var _fsPlus = require('fs-plus');var _fsPlus2 = _interopRequireDefault(_fsPlus);
var _os = require('os');var os = _interopRequireWildcard(_os);
var _telemetry = require('../telemetry');var telemetry = _interopRequireWildcard(_telemetry);function _interopRequireWildcard(obj) {if (obj && obj.__esModule) {return obj;} else {var newObj = {};if (obj != null) {for (var key in obj) {if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];}}newObj.default = obj;return newObj;}}function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

exports.default = {
    name: "Provision function app",
    run: function () {var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(context) {var functionAppName, jsonBody, configFilePath, functionAppResult;return _regenerator2.default.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:
                            functionAppName = void 0;
                            jsonBody = void 0;

                            configFilePath = _path2.default.join(os.homedir(), 'azure-board-cli', 'out', 'functionName.json');
                            if (_fsPlus2.default.isFileSync(configFilePath)) {
                                jsonBody = require(configFilePath);
                            }

                            if (jsonBody && jsonBody.functionAppResourceGroup === context.resourceGroupName && jsonBody.functionAppName) {
                                functionAppName = jsonBody.functionAppName;
                            } else {
                                functionAppName = context.iotHubName + '-' + (0, _v2.default)().slice(0, 4);
                                _fsPlus2.default.writeFileSync(configFilePath, (0, _stringify2.default)({
                                    functionAppName: functionAppName,
                                    functionAppResourceGroup: context.resourceGroupName }));

                            }

                            telemetry.trace('Task provision function app: ' + functionAppName, context.iotHubName);
                            context.armTemplateParameters = context.armTemplateParameters || {};
                            context.armTemplateParameters.functionAppName = {
                                value: functionAppName };


                            context.output = context.output || {};
                            functionAppResult = {
                                functionAppName: functionAppName,
                                functionAppResourceGroup: context.resourceGroupName };


                            context.output = (0, _extends3.default)({}, context.output, functionAppResult);return _context.abrupt('return', 'function app name: ' +
                            functionAppName);case 12:case 'end':return _context.stop();}}}, _callee, undefined);}));return function run(_x) {return _ref.apply(this, arguments);};}() };