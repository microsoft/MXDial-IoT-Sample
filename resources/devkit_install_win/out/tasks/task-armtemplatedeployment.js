'use strict';var _regenerator = require('babel-runtime/regenerator');var _regenerator2 = _interopRequireDefault(_regenerator);var _stringify = require('babel-runtime/core-js/json/stringify');var _stringify2 = _interopRequireDefault(_stringify);var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);var _azurecli = require('../azurecli');var _azurecli2 = _interopRequireDefault(_azurecli);
var _util = require('../util');var util = _interopRequireWildcard(_util);
var _telemetry = require('../telemetry');var telemetry = _interopRequireWildcard(_telemetry);
var _cliSpinner = require('cli-spinner');function _interopRequireWildcard(obj) {if (obj && obj.__esModule) {return obj;} else {var newObj = {};if (obj != null) {for (var key in obj) {if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];}}newObj.default = obj;return newObj;}}function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

exports.default = {
    name: "ARM template deployment",
    run: function () {var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(context) {var spinner, azureCliLocation, azurecli, armTemplateParameters;return _regenerator2.default.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:
                            spinner = new _cliSpinner.Spinner();
                            spinner.start();

                            azureCliLocation = context.azureCliLocation;if (
                            azureCliLocation) {_context.next = 5;break;}throw (
                                new Error('Please install Azure CLI 2.0 first.'));case 5:


                            azurecli = new _azurecli2.default(azureCliLocation);
                            armTemplateParameters = (0, _stringify2.default)(context.armTemplateParameters).replace(/"/g, '\\"');_context.prev = 7;_context.next = 10;return (

                                azurecli.exec('group deployment create --resource-group ' + context.resourceGroupName + ' --template-file "' + context.arduino_project.templateFile + '" --parameters "' + armTemplateParameters + '"', 3600000));case 10:_context.next = 17;break;case 12:_context.prev = 12;_context.t0 = _context['catch'](7);_context.next = 16;return (

                                telemetry.trace('Task ARM template deployment failed: ' + _context.t0, context.iotHubName));case 16:throw (
                                new Error(_context.t0.message));case 17:


                            telemetry.trace('Task ARM template deployment succeeded.');
                            spinner.stop(true);return _context.abrupt('return',
                            "Done");case 20:case 'end':return _context.stop();}}}, _callee, undefined, [[7, 12]]);}));return function run(_x) {return _ref.apply(this, arguments);};}() };