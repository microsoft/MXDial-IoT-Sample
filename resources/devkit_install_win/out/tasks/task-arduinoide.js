'use strict';var _regenerator = require('babel-runtime/regenerator');var _regenerator2 = _interopRequireDefault(_regenerator);var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);var _fsPlus = require('fs-plus');var _fsPlus2 = _interopRequireDefault(_fsPlus);
var _path = require('path');var _path2 = _interopRequireDefault(_path);
var _arduino = require('../arduino');var _arduino2 = _interopRequireDefault(_arduino);
var _os = require('os');var _os2 = _interopRequireDefault(_os);
var _plist = require('plist');var _plist2 = _interopRequireDefault(_plist);
var _telemetry = require('../telemetry');var telemetry = _interopRequireWildcard(_telemetry);function _interopRequireWildcard(obj) {if (obj && obj.__esModule) {return obj;} else {var newObj = {};if (obj != null) {for (var key in obj) {if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];}}newObj.default = obj;return newObj;}}function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

var plat = _os2.default.platform();

var arduino = new _arduino2.default();

var parsePackageInfo = function parsePackageInfo(file) {
    return _plist2.default.parse(_fsPlus2.default.readFileSync(file, 'utf8'));
};

var checkArduinoVersion = function () {var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {var arduinoPath, arduinoVersionFile, arduinoInfoFile, _arduinoVersionFile;return _regenerator2.default.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:_context.prev = 0;_context.next = 3;return (

                            arduino.resolveArduinoPath());case 3:if (!

                        _fsPlus2.default.isFileSync(arduino.command)) {_context.next = 38;break;}
                        arduinoPath = _path2.default.dirname(arduino.command);if (!(

                        plat === 'win32')) {_context.next = 15;break;}
                        arduinoVersionFile = _path2.default.join(arduinoPath, 'lib', 'version.txt');if (!

                        _fsPlus2.default.isFileSync(arduinoVersionFile)) {_context.next = 12;break;}
                        telemetry.trace('task build->check Arduino IDE succeeded');return _context.abrupt('return',
                        _fsPlus2.default.readFileSync(arduinoVersionFile, 'utf-8') + ' @ ' + arduinoPath);case 12:throw (

                            new Error('cannnot find lib/version.txt in Arduino installation path.'));case 13:_context.next = 36;break;case 15:if (!(

                        plat === 'darwin')) {_context.next = 25;break;}
                        // arduinoPath is /Applications/Arduino.app/Contents/Arduino
                        // Info.plist locates at /Applications/Arduino.app/Contents
                        arduinoInfoFile = _path2.default.join(arduinoPath, '..', 'Info.plist');if (!

                        _fsPlus2.default.isFileSync(arduinoInfoFile)) {_context.next = 22;break;}
                        telemetry.trace('task build->check Arduino IDE succeeded');return _context.abrupt('return',
                        parsePackageInfo(arduinoInfoFile).CFBundleShortVersionString + ' @ ' + arduinoPath);case 22:throw (

                            new Error('cannnot find Info.plist in Arduino installation path.'));case 23:_context.next = 36;break;case 25:if (!(

                        plat === 'linux')) {_context.next = 35;break;}
                        _arduinoVersionFile = _path2.default.join(arduinoPath, 'lib', 'version.txt');if (!

                        _fsPlus2.default.isFileSync(_arduinoVersionFile)) {_context.next = 32;break;}
                        telemetry.trace('task build->check Arduino IDE succeeded');return _context.abrupt('return',
                        _fsPlus2.default.readFileSync(_arduinoVersionFile, 'utf-8') + ' @ ' + arduinoPath);case 32:throw (

                            new Error('cannnot find lib/version.txt in Arduino installation path.'));case 33:_context.next = 36;break;case 35:throw (


                            new Error('Unsupported platform: ' + plat));case 36:_context.next = 39;break;case 38:throw (


                            new Error('Missing Arduino IDE, please install Arduino IDE.'));case 39:_context.next = 46;break;case 41:_context.prev = 41;_context.t0 = _context['catch'](0);_context.next = 45;return (


                            telemetry.trace('task build->check Arduino IDE failed: ' + _context.t0.message));case 45:throw (
                            new Error(_context.t0.message));case 46:case 'end':return _context.stop();}}}, _callee, undefined, [[0, 41]]);}));return function checkArduinoVersion() {return _ref.apply(this, arguments);};}();



exports.checkArduinoIde = {
    name: 'Check Arduino IDE Version and Location',
    run: checkArduinoVersion };


exports.checkBoard = {
    name: 'Check Arduino Board',
    run: function () {var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(context) {var boards, definition, boardProperties, board;return _regenerator2.default.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:
                            arduino.loadInstalledBoards();if (
                            context.arduino_project) {_context2.next = 5;break;}_context2.next = 4;return (
                                telemetry.trace('task build->check Arduino board failed: missing project in context'));case 4:throw (
                                new Error('Missing project in context.'));case 5:


                            boards = arduino._boards;
                            definition = context.arduino_project.settings.board;if (

                            definition) {_context2.next = 11;break;}_context2.next = 10;return (
                                telemetry.trace('task build->check Arduino board failed: cannot find board in arduino.json'));case 10:throw (
                                new Error('Cannot find board in arduino.json'));case 11:


                            boardProperties = definition.split(':').map(function (str) {return str.trim();});

                            // boardProperties should have 3 elements, package name, arch, board name. i.e. AZ3166:stm32f4:MXCHIP_AZ3166
                            if (!(boardProperties.length < 3)) {_context2.next = 16;break;}_context2.next = 15;return (
                                telemetry.trace('task build->check Arduino board failed: invalid board in board settings: ' + definition));case 15:throw (
                                new Error('Invalid board in board settings: ' + definition + '.'));case 16:


                            board = boards[boardProperties[2]];if (

                            board) {_context2.next = 21;break;}_context2.next = 20;return (
                                telemetry.trace('task build->check Arduino board failed: cannot find board \'' + boardProperties[2] + '\' in installed board list'));case 20:throw (
                                new Error('Cannot find board \'' + boardProperties[2] + '\' in installed board list.'));case 21:if (!(


                            board.platform !== boardProperties[0])) {_context2.next = 25;break;}_context2.next = 24;return (
                                telemetry.trace('task build->check Arduino board failed: Invalid platform \'' + boardProperties[0] + '\' in board settings: ' + definition + '.'));case 24:throw (
                                new Error('Invalid platform \'' + boardProperties[0] + '\' in board settings: ' + definition + '.'));case 25:if (!(


                            board.architecture !== boardProperties[1])) {_context2.next = 29;break;}_context2.next = 28;return (
                                telemetry.trace('task build->check Arduino board failed: Invalid arch \'' + boardProperties[1] + '\' in board settings: ' + definition + '.'));case 28:throw (
                                new Error('Invalid arch \'' + boardProperties[1] + '\' in board settings: ' + definition + '.'));case 29:


                            telemetry.trace('task build->check Arduino board succeeded');return _context2.abrupt('return',
                            boardProperties[2] + ' as ' + board.name);case 31:case 'end':return _context2.stop();}}}, _callee2, undefined);}));return function run(_x) {return _ref2.apply(this, arguments);};}() };



exports.build_upload = {
    name: 'Build & Upload Sketch',
    run: function () {var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(context) {var settings, rootFolder, sketchFile;return _regenerator2.default.wrap(function _callee3$(_context3) {while (1) {switch (_context3.prev = _context3.next) {case 0:_context3.prev = 0;

                            settings = context.arduino_project.settings;
                            rootFolder = context.arduino_project.rootFolder;
                            sketchFile = void 0;

                            if (!settings.sketch) {
                                sketchFile = _path2.default.join(rootFolder, 'app', 'app.ino');
                            } else {
                                sketchFile = _path2.default.resolve(rootFolder, settings.sketch);
                            }if (

                            _fsPlus2.default.isFileSync(sketchFile)) {_context3.next = 7;break;}throw (
                                new Error(sketchFile + ' cannot be found.'));case 7:_context3.next = 9;return (


                                arduino.upload(settings.board, sketchFile, _path2.default.join(rootFolder, '.build'), function (output) {
                                    console.log(output);
                                }));case 9:_context3.next = 11;return (

                                telemetry.trace('task build->build sketch succeeded', context.iothub));case 11:return _context3.abrupt('return',
                            'success');case 14:_context3.prev = 14;_context3.t0 = _context3['catch'](0);_context3.next = 18;return (

                                telemetry.trace('task build->build sketch failed: ' + _context3.t0.message, context.iothub));case 18:throw (
                                new Error(_context3.t0.message));case 19:case 'end':return _context3.stop();}}}, _callee3, undefined, [[0, 14]]);}));return function run(_x2) {return _ref3.apply(this, arguments);};}() };