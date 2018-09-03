'use strict';Object.defineProperty(exports, "__esModule", { value: true });exports.default = undefined;var _regenerator = require('babel-runtime/regenerator');var _regenerator2 = _interopRequireDefault(_regenerator);var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);var _isInteger = require('babel-runtime/core-js/number/is-integer');var _isInteger2 = _interopRequireDefault(_isInteger);var _assign = require('babel-runtime/core-js/object/assign');var _assign2 = _interopRequireDefault(_assign);var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);var _createClass2 = require('babel-runtime/helpers/createClass');var _createClass3 = _interopRequireDefault(_createClass2);var _os = require('os');var _os2 = _interopRequireDefault(_os);
var _eventKit = require('event-kit');
var _fsPlus = require('fs-plus');var _fsPlus2 = _interopRequireDefault(_fsPlus);
var _path = require('path');var _path2 = _interopRequireDefault(_path);
var _glob = require('glob');var _glob2 = _interopRequireDefault(_glob);
var _util = require('./util');var util = _interopRequireWildcard(_util);
var _child_process = require('child_process');var _child_process2 = _interopRequireDefault(_child_process);
var _bufferredProcess = require('./bufferred-process');var _bufferredProcess2 = _interopRequireDefault(_bufferredProcess);function _interopRequireWildcard(obj) {if (obj && obj.__esModule) {return obj;} else {var newObj = {};if (obj != null) {for (var key in obj) {if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];}}newObj.default = obj;return newObj;}}function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

var OPENOCD_MAGIC_HEADER = 'Open On-Chip Debugger ';
var OPENOCD_TRANSPORT_LIST = ['aice_jtag',
'stlink_swim',
'hla_jtag',
'hla_swd',
'jtag',
'swd'];
var OPENOCD_INTERFACE_LIST = [
'stlink-v1',
'stlink-v2',
'stlink-v2.1',
'jlink',
'cmsis-dap'];var

Openocd = function () {
    function Openocd(opt) {(0, _classCallCheck3.default)(this, Openocd);
        this.opt = (0, _assign2.default)({}, opt);
        this.logLevel = (0, _isInteger2.default)(opt.logLevel) ? opt.logLevel : 1;
        this.port = (0, _isInteger2.default)(opt.port) ? opt.port : 3333;
        this.openocdPath = this.opt["openocdPath"];
        if (!this.openocdPath || !_fsPlus2.default.isDirectorySync(this.openocdPath)) {
            throw new Error('Cannot find openocd path, please specify openocdPath in options.');
        }
        if (this.openocdPath && _path2.default.basename(this.openocdPath) === 'bin') {
            this.openocdPath = _path2.default.dirname(this.openocdPath);
        }
        this.isWin32 = _os2.default.platform() === 'win32';
        this.command = _path2.default.join(this.openocdPath, 'bin', this.isWin32 ? 'openocd.exe' : 'openocd');
        if (!_fsPlus2.default.isFileSync(this.command)) {
            throw new Error('Cannot find openocd at ' + this.openocdPath);
        }
        // finds the scripts folder
        this.scriptsFolder = this.opt["scripts"];
        if (!this.scriptsFolder) {
            this.scriptsFolder = _path2.default.join(this.openocdPath, 'share', 'openocd', 'scripts');
        }
        if (!this.scriptsFolder || !_fsPlus2.default.isDirectorySync(this.scriptsFolder)) {
            throw new Error('Cannot find script directory please specify scripts in options.' + this.scriptsFolder || '');
        }

        this.outFunc = this.opt.outFunc || function (data) {console.log(data);};
    }(0, _createClass3.default)(Openocd, [{ key: 'version', value: function () {var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {var output, ver, match;return _regenerator2.default.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:_context.next = 2;return (


                                    util.execStdout(util.cstr(this.command) + ' --version'));case 2:output = _context.sent;
                                ver = output.slice(OPENOCD_MAGIC_HEADER.length).trim();
                                match = /^(\d+\.\d+\.\d+)/g.exec(ver);if (!(
                                match && match[1])) {_context.next = 9;break;}return _context.abrupt('return',
                                match[1]);case 9:throw (

                                    new Error('invalid version ' + ver));case 10:case 'end':return _context.stop();}}}, _callee, this);}));function version() {return _ref.apply(this, arguments);}return version;}() }, { key: 'execute', value: function () {var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(


            debug_interface, transport, target, script) {var config_file, scriptParam, fillScript, exitcode;return _regenerator2.default.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:if (
                                debug_interface) {_context2.next = 2;break;}throw (
                                    new Error('Missing debug interface'));case 2:if (

                                target) {_context2.next = 4;break;}throw (
                                    new Error('Missing debug target'));case 4:

                                debug_interface = _path2.default.basename(debug_interface.replace('.cfg', ''));
                                target = _path2.default.basename(target.replace('.cfg', ''));if (!(

                                OPENOCD_INTERFACE_LIST.indexOf(debug_interface) < 0)) {_context2.next = 8;break;}throw (
                                    new Error('Unsupported interface ' + debug_interface));case 8:if (!(

                                transport && OPENOCD_TRANSPORT_LIST.indexOf(transport) < 0)) {_context2.next = 10;break;}throw (
                                    new Error('Unsupported transport ' + transport));case 10:if (

                                _fsPlus2.default.isFileSync(_path2.default.join(this.scriptsFolder, 'target', target + '.cfg'))) {_context2.next = 12;break;}throw (
                                    new Error('Cannot find file ' + _path2.default.join(this.scriptsFolder, 'target', target + '.cfg')));case 12:

                                config_file = ['interface/' + debug_interface.replace(/\./g, '-') + '.cfg'];

                                if (transport) {
                                    config_file.push(':transport select ' + transport);
                                }

                                config_file.push('target/' + target + '.cfg');
                                //config_file.push(``);
                                config_file.push(':' + script);

                                scriptParam = [];
                                fillScript = function fillScript(item) {
                                    if (item.startsWith(':')) {
                                        scriptParam.push('-c');
                                        scriptParam.push('' + item.substring(1));
                                    } else {
                                        scriptParam.push('-f');
                                        scriptParam.push(item);
                                    }
                                };
                                config_file.forEach(function (config) {return fillScript(config);});
                                if (this.port !== 3333) {
                                    fillScript(':gdb_port ' + this.port);
                                }
                                if (this.opt.debug) {
                                    scriptParam.push('-d');
                                    scriptParam.push('3');
                                }_context2.next = 23;return (
                                    util.executeWithProgress(this.command, ['-s', this.scriptsFolder].concat(scriptParam), this.outFunc));case 23:exitcode = _context2.sent;if (!(
                                exitcode !== 0)) {_context2.next = 26;break;}throw (
                                    new Error('Upload failure with error code ' + exitcode));case 26:return _context2.abrupt('return',

                                'ok');case 27:case 'end':return _context2.stop();}}}, _callee2, this);}));function execute(_x, _x2, _x3, _x4) {return _ref2.apply(this, arguments);}return execute;}() }]);return Openocd;}();exports.default = Openocd;