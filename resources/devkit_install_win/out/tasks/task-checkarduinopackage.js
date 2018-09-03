'use strict';var _regenerator = require('babel-runtime/regenerator');var _regenerator2 = _interopRequireDefault(_regenerator);var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);var _fsPlus = require('fs-plus');var _fsPlus2 = _interopRequireDefault(_fsPlus);
var _path = require('path');var _path2 = _interopRequireDefault(_path);
var _os = require('os');var _os2 = _interopRequireDefault(_os);
var _telemetry = require('../telemetry');var telemetry = _interopRequireWildcard(_telemetry);function _interopRequireWildcard(obj) {if (obj && obj.__esModule) {return obj;} else {var newObj = {};if (obj != null) {for (var key in obj) {if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];}}newObj.default = obj;return newObj;}}function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

var plat = _os2.default.platform();

var arduinoPackagePath = void 0;
if (plat === 'win32') {
    arduinoPackagePath = _path2.default.join(process.env['USERPROFILE'], 'AppData', 'Local', 'Arduino15');
} else if (plat === 'darwin') {
    arduinoPackagePath = _path2.default.join(process.env.HOME, 'Library', 'Arduino15');
}

var preferencePath = _path2.default.join(arduinoPackagePath, 'preferences.txt');
var devkitPackageIndexPath = _path2.default.join(arduinoPackagePath, 'package_azureboard_index.json');
var devkitPackagePath = _path2.default.join(arduinoPackagePath, 'packages', 'AZ3166');
var devkitPackageToolchainGCCPath = _path2.default.join(devkitPackagePath, 'tools', 'arm-none-eabi-gcc');
var devkitPackageToolchainOpenOCDPath = _path2.default.join(devkitPackagePath, 'tools', 'openocd');
var devkitPackageSDKPath = _path2.default.join(devkitPackagePath, 'hardware', 'stm32f4');

var run = function () {var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(context) {var errorFound, errors;return _regenerator2.default.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:_context.next = 2;return (
                            telemetry.trace('task install->installation done'));case 2:
                        errorFound = false;
                        errors = [];

                        if (!_fsPlus2.default.existsSync(preferencePath)) {
                            console.warn('Warn: Arduino preferences.txt is missing.');
                            errors.push('Arduino preferences.txt is missing.');
                            errorFound = true;
                        }

                        if (_fsPlus2.default.existsSync(preferencePath) && _fsPlus2.default.readFileSync(preferencePath).indexOf('package_azureboard_index.json') === -1) {
                            console.warn('Warn: MXChip board package URL is not updated into preferences.txt.');
                            errors.push('MXChip board package URL is not updated into preferences.txt.');
                            errorFound = true;
                        }

                        if (!_fsPlus2.default.existsSync(devkitPackagePath)) {
                            console.warn('Warn: MXChip board package is extracted failed.');
                            errors.push('MXChip board package is extracted failed.');
                            errorFound = true;
                        }

                        if (_fsPlus2.default.existsSync(devkitPackagePath) && !_fsPlus2.default.existsSync(devkitPackageToolchainGCCPath)) {
                            console.warn('Warn: MXChip board package toolchain arm-gcc is missing.');
                            errors.push('MXChip board package toolchain arm-gcc is missing.');
                            errorFound = true;
                        }

                        if (_fsPlus2.default.existsSync(devkitPackagePath) && !_fsPlus2.default.existsSync(devkitPackageToolchainOpenOCDPath)) {
                            console.warn('Warn: MXChip board package toolchain OpenOCD is missing.');
                            errors.push('MXChip board package toolchain OpenOCD is missing.');
                            errorFound = true;
                        }

                        if (_fsPlus2.default.existsSync(devkitPackagePath) && !_fsPlus2.default.existsSync(devkitPackageSDKPath)) {
                            console.warn('Warn: MXChip board package SDK is missing.');
                            errors.push('MXChip board package SDK is missing.');
                            errorFound = true;
                        }if (!

                        errorFound) {_context.next = 17;break;}
                        console.log('We have found issues for Arduino package, please visit https://aka.ms/devkit to see how to fix.');_context.next = 14;return (
                            telemetry.trace('task install->check arduino package warning: ' + errors.join(' ')));case 14:return _context.abrupt('return',
                        'warning');case 17:_context.next = 19;return (

                            telemetry.trace('task install->check arduino package passed'));case 19:return _context.abrupt('return',
                        'done');case 20:case 'end':return _context.stop();}}}, _callee, undefined);}));return function run(_x) {return _ref.apply(this, arguments);};}();



exports.default = {
    name: "Check Arduino Package",
    run: run };