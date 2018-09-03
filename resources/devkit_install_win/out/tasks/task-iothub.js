'use strict';var _regenerator = require('babel-runtime/regenerator');var _regenerator2 = _interopRequireDefault(_regenerator);var _stringify = require('babel-runtime/core-js/json/stringify');var _stringify2 = _interopRequireDefault(_stringify);var _extends2 = require('babel-runtime/helpers/extends');var _extends3 = _interopRequireDefault(_extends2);var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);var _preference = require('../preference');var pref = _interopRequireWildcard(_preference);
var _telemetry = require('../telemetry');var telemetry = _interopRequireWildcard(_telemetry);
var _util = require('../util');var util = _interopRequireWildcard(_util);
var _lodash = require('lodash');var _lodash2 = _interopRequireDefault(_lodash);
var _azurecli = require('../azurecli');var _azurecli2 = _interopRequireDefault(_azurecli);
var _inquirer = require('inquirer');var _inquirer2 = _interopRequireDefault(_inquirer);
var _username = require('username');var _username2 = _interopRequireDefault(_username);
var _v = require('uuid/v4');var _v2 = _interopRequireDefault(_v);function _interopRequireWildcard(obj) {if (obj && obj.__esModule) {return obj;} else {var newObj = {};if (obj != null) {for (var key in obj) {if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];}}newObj.default = obj;return newObj;}}function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

exports.default = {
    name: "Provision IoT Hub",
    run: function () {var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(context) {var azureCliLocation, azurecli, guid, defaultPreffix, iotHubName, resourceGroupName, freeHubName, hubPreference, hubList, hubIndex, hub, result, _hubIndex, _hub, groupList, _result2, location, _result3, createResourceResponse, _result, iothubResult;return _regenerator2.default.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:if (
                            context.subscription) {_context.next = 2;break;}throw (
                                new Error('Please select subscription first.'));case 2:

                            azureCliLocation = context.azureCliLocation;
                            azurecli = new _azurecli2.default(azureCliLocation);
                            context.armTemplateParameters = context.armTemplateParameters || {};

                            // register provider for subscription 
                            _context.next = 7;return azurecli.exec('provider register -n "Microsoft.Devices"');case 7:

                            guid = (0, _v2.default)().slice(0, 4);_context.next = 10;return (
                                (0, _username2.default)());case 10:defaultPreffix = _context.sent;
                            iotHubName = '';
                            resourceGroupName = '';
                            freeHubName = '';
                            hubPreference = pref.getValue('iot_event_hub');_context.next = 17;return (
                                azurecli.execResultJson('iot hub list'));case 17:hubList = _context.sent;if (!(
                            hubList && hubList.length)) {_context.next = 44;break;}
                            hubIndex = 0;case 20:if (!(hubIndex < hubList.length)) {_context.next = 28;break;}
                            hub = hubList[hubIndex];if (!(
                            hub.sku.name === 'F1')) {_context.next = 25;break;}
                            freeHubName = hub.name;return _context.abrupt('break', 28);case 25:hubIndex++;_context.next = 20;break;case 28:_context.next = 30;return (




                                _inquirer2.default.prompt([{
                                    name: 'choose',
                                    type: 'list',
                                    message: 'Which IoT Hub would you like to choose?',
                                    choices: _lodash2.default.flatten(freeHubName !== '' ? [
                                    new _inquirer2.default.Separator('You have already created a free hub ' + freeHubName + ', and you cannot create more free hubs.'),
                                    new _inquirer2.default.Separator('Select Iot Hub'),
                                    hubList,
                                    new _inquirer2.default.Separator('-------------------')] :
                                    [new _inquirer2.default.Separator('Select Iot Hub'),
                                    hubList,
                                    new _inquirer2.default.Separator('-------------------'),
                                    { name: "Create new...", value: "$$" },
                                    new _inquirer2.default.Separator('-------------------')]),

                                    pageSize: 10,
                                    default: hubPreference }]));case 30:result = _context.sent;if (!(


                            result.choose != '$$')) {_context.next = 44;break;}
                            iotHubName = result.choose;
                            _hubIndex = 0;case 34:if (!(_hubIndex < hubList.length)) {_context.next = 42;break;}
                            _hub = hubList[_hubIndex];if (!(
                            _hub.name === iotHubName)) {_context.next = 39;break;}
                            resourceGroupName = _hub.resourceGroup;return _context.abrupt('break', 42);case 39:_hubIndex++;_context.next = 34;break;case 42:



                            console.log('IoT Hub name is ' + iotHubName);
                            telemetry.trace('Task provision IoT Hub: user chose an IoT Hub', iotHubName);case 44:if (


                            iotHubName) {_context.next = 87;break;}_context.next = 47;return (

                                azurecli.execResultJson('group list'));case 47:groupList = _context.sent;
                            resourceGroupName = '';if (!(
                            groupList && groupList.length)) {_context.next = 54;break;}_context.next = 52;return (
                                _inquirer2.default.prompt([{
                                    name: 'choose',
                                    type: 'list',
                                    message: 'Which Resource Group would you like to choose?',
                                    choices: _lodash2.default.flatten([
                                    new _inquirer2.default.Separator('Select Resource Group'),
                                    groupList,
                                    new _inquirer2.default.Separator('-------------------'),
                                    { name: "Create new...", value: "$$" },
                                    new _inquirer2.default.Separator('-------------------')]),

                                    pageSize: 10 }]));case 52:_result2 = _context.sent;

                            if (_result2.choose != '$$') {
                                resourceGroupName = _result2.choose;
                            }case 54:if (


                            resourceGroupName) {_context.next = 73;break;}_context.next = 57;return (

                                _inquirer2.default.prompt([{
                                    name: 'choose',
                                    type: 'list',
                                    message: 'Resource Group Location:',
                                    choices: _lodash2.default.flatten([
                                    new _inquirer2.default.Separator('------- Asia --------'),
                                    { name: "  East Asia", value: "eastasia" },
                                    { name: "  Southeast Asia", value: "southeastasia" },
                                    { name: "  Central India", value: "centralindia" },
                                    { name: "  South India", value: "southindia" },
                                    { name: "  Japan West", value: "japanwest" },
                                    { name: "  Japan East", value: "japaneast" },
                                    new _inquirer2.default.Separator('------ Europe -------'),
                                    { name: "  North Europe", value: "northeurope" },
                                    { name: "  West Europe", value: "westeurope" },
                                    { name: "  UK South", value: "uksouth" },
                                    { name: "  UK West", value: "ukwest" },
                                    new _inquirer2.default.Separator('--- North America ---'),
                                    { name: "  Central US", value: "centralus" },
                                    { name: "  East US", value: "eastus" },
                                    { name: "  East US 2", value: "eastus2" },
                                    { name: "  West US", value: "westus" },
                                    { name: "  West US 2", value: "westus2" },
                                    { name: "  South Central US", value: "southcentralus" },
                                    { name: "  West Central US", value: "westcentralus" },
                                    { name: "  Canada Central", value: "canadacentral" },
                                    { name: "  Canada East", value: "canadaeast" },
                                    new _inquirer2.default.Separator('------ Oceania ------'),
                                    { name: "  Australia East", value: "australiaeast" },
                                    { name: "  Australia Southeast", value: "australiasoutheast" },
                                    new _inquirer2.default.Separator('--- South America ---'),
                                    { name: "  Brazil South", value: "brazilsouth" }]),

                                    default: 'westus',
                                    pageSize: 10 }]));case 57:location = _context.sent;_context.next = 60;return (


                                _inquirer2.default.prompt([{
                                    name: 'resourceGroupName',
                                    type: 'input',
                                    message: 'Resource Group Name: ',
                                    default: defaultPreffix }]));case 60:_result3 = _context.sent;

                            resourceGroupName = _result3.resourceGroupName + '-group-' + guid;

                            console.log('Creating resource group [' + resourceGroupName + '] ...');_context.prev = 63;_context.next = 66;return (

                                azurecli.execResultJson('group create --name ' + resourceGroupName + ' --location ' + location.choose, 5 * 60000));case 66:createResourceResponse = _context.sent;
                            console.log('Create resource group [' + resourceGroupName + '] ' + createResourceResponse.properties.provisioningState + '.');_context.next = 73;break;case 70:_context.prev = 70;_context.t0 = _context['catch'](63);

                            console.error('Create resource group failed with error ' + _context.t0.message);case 73:



                            _result = null;case 74:

                            if (_result !== null) {
                                console.log('IoT Hub name must contain only alphanumeric characters or hyphen, and must not start or end with hyphen. IoT Hub name must be between 3 and 50 characters long.');
                            }_context.next = 77;return (
                                _inquirer2.default.prompt([{
                                    name: 'iotHubName',
                                    type: 'input',
                                    message: 'IoT Hub Name: ',
                                    default: defaultPreffix }]));case 77:_result = _context.sent;case 78:if (

                            !/^[a-z0-9][\-a-z0-9]+[a-z0-9]$/i.test(_result.iotHubName)) {_context.next = 74;break;}case 79:

                            iotHubName = _result.iotHubName + '-iothub-' + guid;
                            telemetry.trace('Task provision IoT Hub: create new IoT Hub', iotHubName);
                            context.armTemplateParameters.iotHubName = {
                                value: iotHubName };

                            context.armTemplateParameters.iotHubSku = {
                                value: 'F1' };

                            context.armTemplateParameters.iotHubCapacity = {
                                value: 1 };

                            context.armTemplateParameters.iotHubExisted = {
                                value: '' };_context.next = 89;break;case 87:


                            context.armTemplateParameters.iotHubName = {
                                value: iotHubName };

                            context.armTemplateParameters.iotHubExisted = {
                                value: 'existed-' };case 89:



                            context.iotHubName = iotHubName;
                            context.resourceGroupName = resourceGroupName;

                            iothubResult = {
                                iotHubName: iotHubName,
                                subscription: context.subscription,
                                resourceGroup: resourceGroupName };


                            context.output = context.output || {};
                            context.output = (0, _extends3.default)({}, context.output, iothubResult);return _context.abrupt('return',

                            (0, _stringify2.default)(iothubResult));case 95:case 'end':return _context.stop();}}}, _callee, undefined, [[63, 70]]);}));return function run(_x) {return _ref.apply(this, arguments);};}() };