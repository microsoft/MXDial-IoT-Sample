'use strict';var _regenerator = require('babel-runtime/regenerator');var _regenerator2 = _interopRequireDefault(_regenerator);var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);var _promise = require('babel-runtime/core-js/promise');var _promise2 = _interopRequireDefault(_promise);var _telemetry = require('../telemetry');var telemetry = _interopRequireWildcard(_telemetry);
var _path = require('path');var _path2 = _interopRequireDefault(_path);
var _getmac = require('getmac');var _getmac2 = _interopRequireDefault(_getmac);
var _fsPlus = require('fs-plus');var _fsPlus2 = _interopRequireDefault(_fsPlus);
var _crypto = require('crypto');var _crypto2 = _interopRequireDefault(_crypto);
var _os = require('os');var _os2 = _interopRequireDefault(_os);
var _inquirer = require('inquirer');var _inquirer2 = _interopRequireDefault(_inquirer);function _interopRequireWildcard(obj) {if (obj && obj.__esModule) {return obj;} else {var newObj = {};if (obj != null) {for (var key in obj) {if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];}}newObj.default = obj;return newObj;}}function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

var plat = _os2.default.platform();

var _arduinoPackagePath = void 0;
if (plat === 'win32') {
    _arduinoPackagePath = _path2.default.join(process.env['USERPROFILE'], 'AppData', 'Local', 'Arduino15', 'packages');
} else if (plat === 'darwin') {
    _arduinoPackagePath = _path2.default.join(process.env.HOME, 'Library', 'Arduino15', 'packages');
}

var constants = {
    arduinoPackagePath: _path2.default.join(_arduinoPackagePath, 'AZ3166', 'hardware', 'stm32f4'),
    platformLocalFileName: 'platform.local.txt',
    cExtraFlag: 'compiler.c.extra_flags=-DCORRELATIONID="',
    cppExtraFlag: 'compiler.cpp.extra_flags=-DCORRELATIONID="',
    traceExtraFlag: ' -DENABLETRACE=' };


function getHashMacAsync() {
    return new _promise2.default(function (resolve, reject) {
        _getmac2.default.getMac(function (err, macAddress) {
            if (err) {
                reject(error);
            }
            var hash_mac_address = _crypto2.default.createHash('sha256').update(macAddress, 'utf8').digest('hex');
            resolve(hash_mac_address);
        });
    });
}

var run = function () {var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(context) {var files, i, directoryName, fileName, enable_trace, result, hash_mac_address, targetFileName, content;return _regenerator2.default.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:if (
                        _fsPlus2.default.existsSync(constants.arduinoPackagePath)) {_context.next = 4;break;}_context.next = 3;return (

                            telemetry.trace('task build->Generate platform.local.txt failed: unable to find the Arduino package path'));case 3:throw (
                            new Error('Unable to find the Arduino package path, please install the lastest Arduino package for Devkit.'));case 4:


                        files = _fsPlus2.default.readdirSync(constants.arduinoPackagePath);
                        for (i = files.length - 1; i >= 0; i--)
                        {
                            if (files[i] === '.DS_Store')
                            {
                                files.splice(i, 1);
                            }
                        }if (!(

                        files.length === 0 || files.length > 1)) {_context.next = 10;break;}_context.next = 9;return (

                            telemetry.trace('task build->Generate platform.local.txt failed: the number of folders and files is not one.'));case 9:throw (
                            new Error('There are unexpected files or folders under ' + constants.arduinoPackagePath + '. Please clear the folder and reinstall the package for Devkit.'));case 10:


                        directoryName = _path2.default.join(constants.arduinoPackagePath, files[0]);if (
                        _fsPlus2.default.isDirectorySync(directoryName)) {_context.next = 15;break;}_context.next = 14;return (

                            telemetry.trace('task build->Generate platform.local.txt failed: the Arduino package of Devkit is not installed.'));case 14:throw (
                            new Error("The Arduino package of Devkit is not installed. Please follow the guide to install it"));case 15:


                        fileName = _path2.default.join(directoryName, constants.platformLocalFileName);if (

                        _fsPlus2.default.existsSync(fileName)) {_context.next = 50;break;}

                        context.spinner.stop(true);_context.next = 20;return (

                            _inquirer2.default.prompt([{
                                name: 'choose',
                                type: 'confirm',
                                message: '\nMicrosoft would like to collect data about how users use Azure IoT DevKit and some problems they encounter. ' +
                                'Microsoft uses this information to improve our DevKit experience. Participation is voluntary and when you choose to participate ' +
                                'your device automatically sends information to Microsoft about how you use Azure IoT DevKit. ' +
                                '\n\nSelect Y to enable data collection :(Y/n, default is Y) ',

                                pageSize: 10,
                                default: 'Y' }]));case 20:result = _context.sent;

                        context.spinner.start();_context.next = 24;return (
                            telemetry.trace('task build->Generate platform.local.txt, choice of enabling data collection:' + result.choose,
                            null, !result.choose));case 24:

                        if (result.choose === true)
                        {
                            enable_trace = 1;
                        } else

                        {
                            enable_trace = 0;
                        }_context.prev = 25;_context.next = 28;return (




                            getHashMacAsync());case 28:hash_mac_address = _context.sent;_context.next = 36;break;case 31:_context.prev = 31;_context.t0 = _context['catch'](25);_context.next = 35;return (



                            telemetry.trace('task build->Generate platform.local.txt failed:' + _context.t0.message));case 35:throw (
                            new Error(_context.t0.message));case 36:

                        //Create the file of platform.local.txt
                        targetFileName = _path2.default.join(directoryName, constants.platformLocalFileName);

                        content = '' + constants.cExtraFlag + hash_mac_address + '" ' + constants.traceExtraFlag + enable_trace + '\r\n' + ('' +
                        constants.cppExtraFlag + hash_mac_address + '" ' + constants.traceExtraFlag + enable_trace + '\r\n');_context.prev = 38;


                        _fsPlus2.default.writeFileSync(targetFileName, content);_context.next = 47;break;case 42:_context.prev = 42;_context.t1 = _context['catch'](38);_context.next = 46;return (



                            telemetry.trace('task build->Write data into platform.local.txt failed:' + error.message));case 46:throw (
                            new Error(error.message));case 47:return _context.abrupt('return',

                        "platform.local.txt generated successfully");case 50:return _context.abrupt('return',



                        "platform.local.txt already exists");case 51:case 'end':return _context.stop();}}}, _callee, undefined, [[25, 31], [38, 42]]);}));return function run(_x) {return _ref.apply(this, arguments);};}();



exports.default = {
    name: "Generate platform.local.txt",
    run: run };