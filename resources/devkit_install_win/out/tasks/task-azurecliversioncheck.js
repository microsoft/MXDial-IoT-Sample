'use strict';var _regenerator = require('babel-runtime/regenerator');var _regenerator2 = _interopRequireDefault(_regenerator);var _extends2 = require('babel-runtime/helpers/extends');var _extends3 = _interopRequireDefault(_extends2);var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);var _os = require('os');var _os2 = _interopRequireDefault(_os);
var _fsPlus = require('fs-plus');var _fsPlus2 = _interopRequireDefault(_fsPlus);
var _glob = require('glob');var _glob2 = _interopRequireDefault(_glob);
var _lodash = require('lodash');var _lodash2 = _interopRequireDefault(_lodash);
var _v = require('uuid/v4');var _v2 = _interopRequireDefault(_v);
var _open = require('open');var _open2 = _interopRequireDefault(_open);
var _util = require('../util');var util = _interopRequireWildcard(_util);
var _inquirer = require('inquirer');var _inquirer2 = _interopRequireDefault(_inquirer);
var _preference = require('../preference');var pref = _interopRequireWildcard(_preference);
var _azurecli = require('../azurecli');var _azurecli2 = _interopRequireDefault(_azurecli);
var _constants = require('../constants');var _constants2 = _interopRequireDefault(_constants);
var _username = require('username');var _username2 = _interopRequireDefault(_username);
var _telemetry = require('../telemetry');var telemetry = _interopRequireWildcard(_telemetry);
var _semver = require('semver');var _semver2 = _interopRequireDefault(_semver);function _interopRequireWildcard(obj) {if (obj && obj.__esModule) {return obj;} else {var newObj = {};if (obj != null) {for (var key in obj) {if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];}}newObj.default = obj;return newObj;}}function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

exports.default = {
    name: "check Azure CLI version",
    run: function () {var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(context) {var azurecli, location, azureCliResult, azureCliVersion;return _regenerator2.default.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:_context.prev = 0;

                            azurecli = new _azurecli2.default();_context.next = 4;return (
                                azurecli.getAzureCliLocation());case 4:location = _context.sent;if (!

                            location) {_context.next = 23;break;}

                            context.azureCliLocation = location;
                            azureCliResult = {
                                azureCliLocation: location };

                            context.output = context.output || {};
                            context.output = (0, _extends3.default)({}, context.output, azureCliResult);_context.next = 12;return (
                                azurecli.version());case 12:azureCliVersion = _context.sent;if (!

                            _semver2.default.lt(azureCliVersion, _constants2.default.AZURE_CLI_MINIMUM_VERSION)) {_context.next = 17;break;}throw (
                                new Error('The version of Azure CLI ' + azureCliVersion + ' is too low, please install ' + _constants2.default.AZURE_CLI_MINIMUM_VERSION + ' or higher'));case 17:_context.next = 19;return (


                                telemetry.trace("Task check Azure CLI version succeeded"));case 19:
                            context.azureCliVersion = azureCliVersion;return _context.abrupt('return',
                            azureCliVersion);case 21:_context.next = 24;break;case 23:throw (



                                new Error('Cannot find Azure CLI, please install Azure CLI from https://docs.microsoft.com/en-us/cli/azure/install-azure-cli'));case 24:_context.next = 31;break;case 26:_context.prev = 26;_context.t0 = _context['catch'](0);_context.next = 30;return (


                                telemetry.trace('Task check Azure CLI version failed: ' + _context.t0.message));case 30:throw _context.t0;case 31:case 'end':return _context.stop();}}}, _callee, undefined, [[0, 26]]);}));return function run(_x) {return _ref.apply(this, arguments);};}() };