'use strict';var _regenerator = require('babel-runtime/regenerator');var _regenerator2 = _interopRequireDefault(_regenerator);var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);var _util = require('../util');var util = _interopRequireWildcard(_util);
var _semver = require('semver');var _semver2 = _interopRequireDefault(_semver);
var _path = require('path');var _path2 = _interopRequireDefault(_path);
var _fsExtra = require('fs-extra');var _fsExtra2 = _interopRequireDefault(_fsExtra);
var _admZip = require('adm-zip');var _admZip2 = _interopRequireDefault(_admZip);
var _os = require('os');var _os2 = _interopRequireDefault(_os);
var _arch = require('arch');var _arch2 = _interopRequireDefault(_arch);
var _arduino = require('../arduino');var _arduino2 = _interopRequireDefault(_arduino);
var _telemetry = require('../telemetry');var telemetry = _interopRequireWildcard(_telemetry);
var _azurecli = require('../azurecli');var _azurecli2 = _interopRequireDefault(_azurecli);
var _constants = require('../constants');var _constants2 = _interopRequireDefault(_constants);
var _plist = require('plist');var _plist2 = _interopRequireDefault(_plist);function _interopRequireWildcard(obj) {if (obj && obj.__esModule) {return obj;} else {var newObj = {};if (obj != null) {for (var key in obj) {if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];}}newObj.default = obj;return newObj;}}function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

var HARDWARE = '1.3.2';
var plat = _os2.default.platform();

var _vsCodeExePath = void 0,_arduinoPackagePath = void 0;
if (plat === 'win32') {
    _vsCodeExePath = _path2.default.join(process.env['ProgramFiles'], 'Microsoft VS Code', 'bin', 'code');
    _arduinoPackagePath = _path2.default.join(process.env['USERPROFILE'], 'AppData', 'Local', 'Arduino15', 'packages');
} else if (plat === 'darwin') {
    _vsCodeExePath = '/Applications/Visual Studio Code.app/Contents/Resources/app/bin/code';
    _arduinoPackagePath = _path2.default.join(process.env.HOME, 'Library', 'Arduino15', 'packages');
}

var constants = {
    azureCliMsiPath: _path2.default.join(__dirname, '..', '..', 'tools', 'win32', 'azure-cli-2.0.20.msi'),
    vsCodeInstallPath: _path2.default.join(__dirname, '..', '..', 'tools', 'win32', 'VSCodeSetup-ia32-1.17.2.exe'),
    vsCodeInstallPath64: _path2.default.join(__dirname, '..', '..', 'tools', 'win32', 'VSCodeSetup-x64-1.17.2.exe'),
    arduinoInstallPath: _path2.default.join(__dirname, '..', '..', 'tools', 'win32', 'arduino-1.8.1-windows.exe'),
    vsCodeExePath: _vsCodeExePath,
    arduinoMarketPlaceExtensionName: 'vsciot-vscode.vscode-arduino',
    boardManagerUrl: process.env.DEVKIT_BOARD_URL || 'https://raw.githubusercontent.com/VSChina/azureiotdevkit_tools/master/package_azureboard_index.json',
    customBoardZip: _path2.default.join(__dirname, '..', '..', 'tools', 'AZ3166.zip'),
    arduinoPackagePath: _arduinoPackagePath,
    installed: 'installed' };


var arduinoLocation = '';
var stlinkInstallPath = _path2.default.join(__dirname, '..', '..', 'tools', 'win32', 'st-link');
if (util.isWin32X64()) {
    stlinkInstallPath = _path2.default.join(stlinkInstallPath, 'dpinst_amd64.exe');
} else {
    stlinkInstallPath = _path2.default.join(stlinkInstallPath, 'dpinst_x86.exe');
}

var commands = {
    checkVsCode: 'code --version',
    win32: {
        azureCliInstall: 'msiexec /i "' + constants.azureCliMsiPath + '" /passive /norestart ADDLOCAL=ALL ALLUSERS=1',
        vsCodeInstall: '"' + constants.vsCodeInstallPath + '" /SILENT /mergetasks=!runcode',
        vsCodeInstall64: '"' + constants.vsCodeInstallPath64 + '" /SILENT /mergetasks=!runcode',
        arduinoInstall: '"' + constants.arduinoInstallPath + '" /S',
        stlinkInstall: '"' + stlinkInstallPath + '"' },

    darwin: {
        azureCliInstall: 'brew reinstall azure-cli',
        // with --force to install items not in the list
        // https://github.com/Homebrew/homebrew-bundle/issues/258#issuecomment-281320560
        vsCodeInstall: 'brew cask reinstall --force visual-studio-code',
        arduinoInstall: 'brew cask reinstall --force arduino',
        stlinkInstall: 'brew reinstall stlink' } };



var timeout = 600 * 1000;

exports.installCli = {
    name: 'Install Azure CLI',
    run: function () {var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(context) {var azureCliVersion, shouldInstall, azurecli, location;return _regenerator2.default.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:_context.prev = 0;

                            azureCliVersion = void 0;
                            shouldInstall = false;
                            azurecli = new _azurecli2.default(null);_context.next = 6;return (
                                azurecli.getAzureCliLocation());case 6:location = _context.sent;if (
                            location) {_context.next = 11;break;}
                            shouldInstall = true;_context.next = 15;break;case 11:_context.next = 13;return (


                                azurecli.version());case 13:azureCliVersion = _context.sent;
                            if (_semver2.default.lt(azureCliVersion, _constants2.default.AZURE_CLI_MINIMUM_VERSION)) {
                                shouldInstall = true;
                            }case 15:if (!


                            shouldInstall) {_context.next = 24;break;}if (!(
                            plat === 'win32')) {_context.next = 21;break;}_context.next = 19;return (
                                util.execStdout(commands.win32.azureCliInstall, timeout));case 19:_context.next = 24;break;case 21:if (!(
                            plat === 'darwin')) {_context.next = 24;break;}_context.next = 24;return (
                                util.execStdout(commands.darwin.azureCliInstall, timeout));case 24:



                            telemetry.trace("Task install Azure CLI succeeded");if (!

                            shouldInstall) {_context.next = 29;break;}return _context.abrupt('return',
                            constants.installed);case 29:return _context.abrupt('return',

                            azureCliVersion);case 30:_context.next = 37;break;case 32:_context.prev = 32;_context.t0 = _context['catch'](0);_context.next = 36;return (


                                telemetry.trace('Task install Azure CLI failed: ' + _context.t0));case 36:throw _context.t0;case 37:case 'end':return _context.stop();}}}, _callee, undefined, [[0, 32]]);}));return function run(_x) {return _ref.apply(this, arguments);};}() };





exports.installVsCode = {
    name: 'Install VS Code',
    run: function () {var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(context) {var shouldInstall, ver;return _regenerator2.default.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:
                            shouldInstall = false;_context2.prev = 1;_context2.next = 4;return (

                                util.execStdout(commands.checkVsCode));case 4:ver = _context2.sent;
                            ver = ver.substr(0, ver.indexOf('\n'));if (!
                            _semver2.default.lt(ver, '1.13.1')) {_context2.next = 10;break;}
                            if (plat === 'win32') {
                                console.warn("The current VSCode version is too low, please uninstall VSCode or upgrade to the latest version first, and then run install.cmd again.");
                                process.exit();
                            } else {
                                context.code = 'code';
                                shouldInstall = true;
                            }_context2.next = 13;break;case 10:

                            context.code = 'code';
                            telemetry.trace("task install->vscode already installed");return _context2.abrupt('return',
                            ver);case 13:_context2.next = 19;break;case 15:_context2.prev = 15;_context2.t0 = _context2['catch'](1);


                            shouldInstall = true;
                            context.code = '"' + constants.vsCodeExePath + '"';case 19:if (!(


                            plat === 'win32')) {_context2.next = 43;break;}if (!
                            shouldInstall) {_context2.next = 40;break;}_context2.prev = 21;if (!(

                            (0, _arch2.default)() === 'x64')) {_context2.next = 27;break;}_context2.next = 25;return (
                                util.execStdout(commands.win32.vsCodeInstall64, timeout));case 25:_context2.next = 29;break;case 27:_context2.next = 29;return (

                                util.execStdout(commands.win32.vsCodeInstall, timeout));case 29:

                            telemetry.trace("task install->install vscode succeeded");return _context2.abrupt('return',
                            constants.installed);case 33:_context2.prev = 33;_context2.t1 = _context2['catch'](21);_context2.next = 37;return (

                                telemetry.trace('task install->install vscode failed: ' + _context2.t1));case 37:throw _context2.t1;case 38:_context2.next = 41;break;case 40:




                            telemetry.trace("task install->vscode already installed");case 41:_context2.next = 58;break;case 43:if (!(

                            plat === 'darwin')) {_context2.next = 58;break;}if (!
                            shouldInstall) {_context2.next = 58;break;}_context2.prev = 45;_context2.next = 48;return (

                                util.execStdout(commands.darwin.vsCodeInstall, timeout));case 48:
                            context.code = '"' + constants.vsCodeExePath + '"';
                            telemetry.trace("task install->install vscode succeeded");return _context2.abrupt('return',
                            constants.installed);case 53:_context2.prev = 53;_context2.t2 = _context2['catch'](45);_context2.next = 57;return (

                                telemetry.trace('task install->install vscode failed: ' + _context2.t2));case 57:throw _context2.t2;case 58:case 'end':return _context2.stop();}}}, _callee2, undefined, [[1, 15], [21, 33], [45, 53]]);}));return function run(_x2) {return _ref2.apply(this, arguments);};}() };







exports.installArduinoExtension = {
    name: 'Install Arduino Extension',
    run: function () {var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(context) {return _regenerator2.default.wrap(function _callee3$(_context3) {while (1) {switch (_context3.prev = _context3.next) {case 0:_context3.prev = 0;_context3.next = 3;return (

                                util.execStdout(context.code + ' --install-extension "' + constants.arduinoMarketPlaceExtensionName + '"', timeout));case 3:
                            telemetry.trace("task install->install arduino extension succeeded");return _context3.abrupt('return',
                            constants.installed);case 7:_context3.prev = 7;_context3.t0 = _context3['catch'](0);_context3.next = 11;return (

                                telemetry.trace('task install->install arduino extension failed: ' + _context3.t0));case 11:throw _context3.t0;case 12:case 'end':return _context3.stop();}}}, _callee3, undefined, [[0, 7]]);}));return function run(_x3) {return _ref3.apply(this, arguments);};}() };





exports.installArduino = {
    name: 'Install Arduino',
    run: function () {var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {var needInstall, arduino, ver, info, _ver;return _regenerator2.default.wrap(function _callee4$(_context4) {while (1) {switch (_context4.prev = _context4.next) {case 0:
                            needInstall = false;_context4.prev = 1;

                            arduino = new _arduino2.default();_context4.next = 5;return (
                                arduino.resolveArduinoPath());case 5:if (!
                            _fsExtra2.default.existsSync(arduino.command)) {_context4.next = 37;break;}if (!(
                            plat === 'win32')) {_context4.next = 21;break;}if (!
                            _fsExtra2.default.existsSync(_path2.default.join(_path2.default.dirname(arduino.command), "lib/version.txt"))) {_context4.next = 18;break;}
                            ver = _fsExtra2.default.readFileSync(_path2.default.join(_path2.default.dirname(arduino.command), "lib/version.txt"), 'utf-8');if (!
                            _semver2.default.lt(ver, '1.8.1')) {_context4.next = 13;break;}
                            needInstall = true;_context4.next = 16;break;case 13:

                            telemetry.trace("task install->arduino already installed");
                            arduinoLocation = arduino.command;return _context4.abrupt('return',
                            ver);case 16:_context4.next = 19;break;case 18:


                            needInstall = true;case 19:_context4.next = 35;break;case 21:if (!(

                            plat === 'darwin')) {_context4.next = 35;break;}if (!
                            _fsExtra2.default.existsSync('/Applications/Arduino.app/Contents/Info.plist')) {_context4.next = 34;break;}
                            info = _fsExtra2.default.readFileSync('/Applications/Arduino.app/Contents/Info.plist', 'utf-8');
                            _ver = _plist2.default.parse(info).CFBundleShortVersionString;if (!
                            _semver2.default.lt(_ver, '1.8.1')) {_context4.next = 29;break;}
                            needInstall = true;_context4.next = 32;break;case 29:

                            telemetry.trace("task install->arduino already installed");
                            arduinoLocation = arduino.command;return _context4.abrupt('return',
                            _ver);case 32:_context4.next = 35;break;case 34:


                            needInstall = true;case 35:_context4.next = 38;break;case 37:



                            needInstall = true;case 38:_context4.next = 49;break;case 40:_context4.prev = 40;_context4.t0 = _context4['catch'](1);if (!(


                            _context4.t0.toString().indexOf('Error: Cannot find arduino') !== -1)) {_context4.next = 46;break;}
                            needInstall = true;_context4.next = 49;break;case 46:_context4.next = 48;return (

                                telemetry.trace('task install->install arduino failed: ' + _context4.t0));case 48:throw _context4.t0;case 49:if (!



                            needInstall) {_context4.next = 72;break;}_context4.prev = 50;if (!(

                            plat === 'win32')) {_context4.next = 57;break;}_context4.next = 54;return (
                                util.execStdout(commands.win32.arduinoInstall, timeout));case 54:
                            arduinoLocation = _path2.default.join(process.env['ProgramFiles(x86)'] || process.env['ProgramFiles'], 'Arduino', 'arduino_debug.exe');_context4.next = 61;break;case 57:if (!(
                            plat === 'darwin')) {_context4.next = 61;break;}_context4.next = 60;return (
                                util.execStdout(commands.darwin.arduinoInstall, timeout));case 60:
                            arduinoLocation = '/Applications/Arduino.app/Contents/MacOS/Arduino';case 61:

                            telemetry.trace("task install->install arduino succeeded");return _context4.abrupt('return',
                            constants.installed);case 65:_context4.prev = 65;_context4.t1 = _context4['catch'](50);_context4.next = 69;return (

                                telemetry.trace('task install->install arduino failed: ' + _context4.t1));case 69:throw _context4.t1;case 70:_context4.next = 73;break;case 72:




                            telemetry.trace("task install->arduino already installed");case 73:case 'end':return _context4.stop();}}}, _callee4, undefined, [[1, 40], [50, 65]]);}));return function run() {return _ref4.apply(this, arguments);};}() };




exports.setBoardUrl = {
    name: 'Set Custom Board Manager URL',
    run: function () {var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5() {var existingUrls, arduino, preferenceFilePath, preference;return _regenerator2.default.wrap(function _callee5$(_context5) {while (1) {switch (_context5.prev = _context5.next) {case 0:
                            existingUrls = void 0;_context5.prev = 1;

                            arduino = new _arduino2.default();
                            existingUrls = arduino.listBoardPackageUrl();
                            if (existingUrls.indexOf(constants.boardManagerUrl) === -1) {
                                existingUrls.push(constants.boardManagerUrl);
                            }

                            // force Arduino generate preferences.txt by running install unexisting board, bummy
                            // this command must fail as dummy is not existed
                            _context5.prev = 5;_context5.next = 8;return (
                                util.execStderr('"' + arduinoLocation + '" --install-boards dummy', 30000));case 8:_context5.next = 12;break;case 10:_context5.prev = 10;_context5.t0 = _context5['catch'](5);case 12:_context5.next = 14;return (


                                util.execStderr('"' + arduinoLocation + '" --pref boardsmanager.additional.urls=' + existingUrls.join(',') + ' --save-prefs', 30000));case 14:
                            telemetry.trace('task install->set custom board manager url succeeded');return _context5.abrupt('return',
                            'done');case 18:_context5.prev = 18;_context5.t1 = _context5['catch'](1);

                            // if error occured, we need check preferences file to confirm
                            preferenceFilePath = _path2.default.join(constants.arduinoPackagePath, '..', 'preferences.txt');if (!
                            _fsExtra2.default.existsSync(preferenceFilePath)) {_context5.next = 26;break;}
                            preference = _fsExtra2.default.readFileSync(preferenceFilePath);if (!(
                            preference.indexOf('package_azureboard_index.json') !== -1)) {_context5.next = 26;break;}
                            telemetry.trace('task install->set custom board manager url warning');return _context5.abrupt('return',
                            'done');case 26:_context5.next = 28;return (


                                telemetry.trace('task install->set custom board manager url failed: ' + _context5.t1));case 28:throw _context5.t1;case 29:case 'end':return _context5.stop();}}}, _callee5, undefined, [[1, 18], [5, 10]]);}));return function run() {return _ref5.apply(this, arguments);};}() };





exports.installBoardPackage = {
    name: 'Install Board Package',
    run: function () {var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6() {return _regenerator2.default.wrap(function _callee6$(_context6) {while (1) {switch (_context6.prev = _context6.next) {case 0:_context6.prev = 0;_context6.next = 3;return (

                                util.execStderr('"' + arduinoLocation + '" --install-boards AZ3166:stm32f4:' + HARDWARE, 300000));case 3:_context6.next = 10;break;case 5:_context6.prev = 5;_context6.t0 = _context6['catch'](0);if (!(

                            _context6.t0.message.indexOf('Platform is already installed!') === -1)) {_context6.next = 10;break;}
                            telemetry.trace('task install->install board package failed: ' + _context6.t0);throw _context6.t0;case 10:




                            telemetry.trace("task install->install board package succeeded");return _context6.abrupt('return',
                            constants.installed);case 12:case 'end':return _context6.stop();}}}, _callee6, undefined, [[0, 5]]);}));return function run() {return _ref6.apply(this, arguments);};}() };



exports.installSTLink = {
    name: 'Install ST Link',
    run: function () {var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7() {return _regenerator2.default.wrap(function _callee7$(_context7) {while (1) {switch (_context7.prev = _context7.next) {case 0:_context7.prev = 0;if (!(

                            plat === 'win32')) {_context7.next = 6;break;}_context7.next = 4;return (
                                util.execStdout(commands.win32.stlinkInstall, timeout));case 4:_context7.next = 9;break;case 6:if (!(
                            plat === 'darwin')) {_context7.next = 9;break;}_context7.next = 9;return (
                                util.execStdout(commands.darwin.stlinkInstall, timeout));case 9:

                            telemetry.trace("task install->install st link succeeded");return _context7.abrupt('return',
                            constants.installed);case 13:_context7.prev = 13;_context7.t0 = _context7['catch'](0);return _context7.abrupt('return',


                            constants.installed);case 16:case 'end':return _context7.stop();}}}, _callee7, undefined, [[0, 13]]);}));return function run() {return _ref7.apply(this, arguments);};}() };




var _createFolderIfNotExist = function _createFolderIfNotExist(directory) {
    if (!_fsExtra2.default.existsSync(directory)) {
        _fsExtra2.default.mkdirSync(directory);
    }
};

// const _parsePipVersion = verStr => {
//     const pipVersionRe = /pip (.*) from .* \(python (.*)\)/i;
//     return verStr.match(pipVersionRe);
// };

var _removeFolderRecursive = function _removeFolderRecursive(directory) {
    if (_fsExtra2.default.existsSync(directory)) {
        _fsExtra2.default.readdirSync(directory).forEach(function (file, index) {
            var curPath = _path2.default.join(directory, file);
            if (_fsExtra2.default.lstatSync(curPath).isDirectory()) {// recurse
                _removeFolderRecursive(curPath);
            } else {// delete file
                _fsExtra2.default.unlinkSync(curPath);
            }
        });
        _fsExtra2.default.rmdirSync(directory);
    }
};