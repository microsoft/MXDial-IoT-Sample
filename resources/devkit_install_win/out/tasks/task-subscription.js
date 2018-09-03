'use strict';var _regenerator = require('babel-runtime/regenerator');var _regenerator2 = _interopRequireDefault(_regenerator);var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);var _util = require('../util');var util = _interopRequireWildcard(_util);
var _fsPlus = require('fs-plus');var _fsPlus2 = _interopRequireDefault(_fsPlus);
var _glob = require('glob');var _glob2 = _interopRequireDefault(_glob);
var _lodash = require('lodash');var _lodash2 = _interopRequireDefault(_lodash);
var _v = require('uuid/v4');var _v2 = _interopRequireDefault(_v);
var _open = require('open');var _open2 = _interopRequireDefault(_open);
var _inquirer = require('inquirer');var _inquirer2 = _interopRequireDefault(_inquirer);
var _preference = require('../preference');var pref = _interopRequireWildcard(_preference);
var _azurecli = require('../azurecli');var _azurecli2 = _interopRequireDefault(_azurecli);
var _username = require('username');var _username2 = _interopRequireDefault(_username);
var _telemetry = require('../telemetry');var telemetry = _interopRequireWildcard(_telemetry);function _interopRequireWildcard(obj) {if (obj && obj.__esModule) {return obj;} else {var newObj = {};if (obj != null) {for (var key in obj) {if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];}}newObj.default = obj;return newObj;}}function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

var azureCliLocation = void 0;
var subscriptions = void 0;
var currentSubs = void 0;
var azurecli = void 0;
var scenarioName = "get azure subscription";

var _login = function () {var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {return _regenerator2.default.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:_context.next = 2;return (
                            util.executeWithProgress(azureCliLocation, ['login'], function (line, channel) {
                                if (channel === 'stdout') {
                                    console.log('[azurecli]', line);
                                } else {
                                    if (line.includes('To sign in, use a web browser to open the page')) {
                                        var codeRegex = /enter\sthe\scode\s(\w+)\sto\sauthenticate/g.exec(line);
                                        if (codeRegex && codeRegex[1]) {

                                            (0, _open2.default)('https://aka.ms/devicelogin', function (err) {
                                                if (err) {
                                                    console.log('Please open https://aka.ms/devicelogin and input the following code:', codeRegex[1]);
                                                } else {
                                                    console.log('Please input the following code:', codeRegex[1]);
                                                }
                                            });
                                        }
                                    }
                                }
                            }));case 2:case 'end':return _context.stop();}}}, _callee, undefined);}));return function _login() {return _ref.apply(this, arguments);};}();


exports.default = {
    name: scenarioName,
    run: function () {var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(context) {var subsList, subsPreference, result;return _regenerator2.default.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:if (
                            context.azureCliVersion) {_context2.next = 2;break;}throw (
                                new Error('Please install Azure CLI 2.0 first.'));case 2:


                            azureCliLocation = context.azureCliLocation;
                            azurecli = new _azurecli2.default(azureCliLocation);

                            // Use a lightweight command to verify if the azure login credential is expired, so that user can have a chance to login again
                            _context2.prev = 4;_context2.next = 7;return (
                                azurecli.exec('tag list'));case 7:_context2.next = 14;break;case 9:_context2.prev = 9;_context2.t0 = _context2['catch'](4);


                            console.error('You\'re not logged in or credential has expired, please login azure again.');_context2.next = 14;return (
                                _login());case 14:


                            telemetry.trace("Task get azure subscription: Azure CLI login successfully");

                            // Fetch azure subscriptions
                            _context2.next = 17;return azurecli.execResultJson("account list");case 17:subscriptions = _context2.sent;if (!(


                            !subscriptions || !subscriptions.length)) {_context2.next = 22;break;}_context2.next = 21;return (

                                telemetry.trace('Task get azure subscription failed: cannot get user subscriptions'));case 21:throw (
                                new Error('Cannot get subscriptions.'));case 22:


                            subsList = _lodash2.default.map(subscriptions, function (sub) {
                                return {
                                    name: sub.name + ' (' + sub.id + ') (' + sub.user.name + ')',
                                    value: sub };

                            });
                            subsPreference = pref.getValue('subscription');_context2.next = 26;return (
                                _inquirer2.default.prompt([{
                                    name: 'choose',
                                    type: 'list',
                                    message: 'What subscription would you like to choose?',
                                    choices: _lodash2.default.flatten([
                                    new _inquirer2.default.Separator('Select Subscription'),
                                    subsList,
                                    new _inquirer2.default.Separator('-------------------')]),

                                    default: subsPreference ? _lodash2.default.findIndex(subsList, { name: subsPreference }) : 0 }]));case 26:result = _context2.sent;_context2.next = 29;return (

                                azurecli.execNoOutput('account set --subscription ' + result.choose.id));case 29:
                            currentSubs = result.choose;
                            context.subscription = currentSubs;
                            pref.setValue('subscription', result.choose.name + ' (' + result.choose.id + ')');
                            pref.savePreference();_context2.next = 35;return (

                                telemetry.trace('Task get azure subscription succeeded.'));case 35:
                            context.subscription = result.choose.id;return _context2.abrupt('return',
                            result.choose.id);case 37:case 'end':return _context2.stop();}}}, _callee2, undefined, [[4, 9]]);}));return function run(_x) {return _ref2.apply(this, arguments);};}() };