'use strict';Object.defineProperty(exports, "__esModule", { value: true });exports.default = undefined;var _regenerator = require('babel-runtime/regenerator');var _regenerator2 = _interopRequireDefault(_regenerator);var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);var _createClass2 = require('babel-runtime/helpers/createClass');var _createClass3 = _interopRequireDefault(_createClass2);var _fsPlus = require('fs-plus');var _fsPlus2 = _interopRequireDefault(_fsPlus);
var _path = require('path');var _path2 = _interopRequireDefault(_path);
var _util = require('./util');var util = _interopRequireWildcard(_util);
var _os = require('os');var _os2 = _interopRequireDefault(_os);
var _glob = require('glob');var _glob2 = _interopRequireDefault(_glob);function _interopRequireWildcard(obj) {if (obj && obj.__esModule) {return obj;} else {var newObj = {};if (obj != null) {for (var key in obj) {if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];}}newObj.default = obj;return newObj;}}function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

var TIMEOUT = 60000;var
AzureCli = function () {
    function AzureCli(location) {(0, _classCallCheck3.default)(this, AzureCli);
        if (location && _fsPlus2.default.isFileSync(location)) {
            this.location = util.cstr(location);
        } else
        {
            this.location = null;
        }
    }(0, _createClass3.default)(AzureCli, [{ key: 'exec', value: function exec(

        command, timeout) {
            if (!this.location) {
                return null;
            }
            return util.execStdout(this.location + ' ' + command, timeout || TIMEOUT);
        } }, { key: 'version', value: function () {var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {var result;return _regenerator2.default.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:_context.next = 2;return (


                                    this.exec("--version"));case 2:result = _context.sent;if (

                                result) {_context.next = 5;break;}throw (
                                    new Error('no output for az --version'));case 5:return _context.abrupt('return',

                                /\(([\w\.]+)\)/g.exec(result.split('\n')[0])[1]);case 6:case 'end':return _context.stop();}}}, _callee, this);}));function version() {return _ref.apply(this, arguments);}return version;}() }, { key: 'execResultJson', value: function () {var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(


            command, timeout) {var output;return _regenerator2.default.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:_context2.next = 2;return (
                                    util.execStdout(this.location + " " + command, timeout || TIMEOUT));case 2:output = _context2.sent;if (!
                                output) {_context2.next = 13;break;}_context2.prev = 4;return _context2.abrupt('return',

                                JSON.parse(output));case 8:_context2.prev = 8;_context2.t0 = _context2['catch'](4);throw (

                                    new Error('Bad result when executing "az ' + command + '":' + output));case 11:_context2.next = 14;break;case 13:throw (


                                    new Error('No output when executing "az ' + command + '"'));case 14:case 'end':return _context2.stop();}}}, _callee2, this, [[4, 8]]);}));function execResultJson(_x, _x2) {return _ref2.apply(this, arguments);}return execResultJson;}() }, { key: 'execResultJsonWithoutError', value: function () {var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(



            command, timeout) {var output;return _regenerator2.default.wrap(function _callee3$(_context3) {while (1) {switch (_context3.prev = _context3.next) {case 0:_context3.next = 2;return (
                                    util.execStdoutWithoutError(this.location + " " + command, timeout || TIMEOUT));case 2:output = _context3.sent;if (!
                                output) {_context3.next = 13;break;}_context3.prev = 4;return _context3.abrupt('return',

                                JSON.parse(output));case 8:_context3.prev = 8;_context3.t0 = _context3['catch'](4);throw (

                                    new Error('Bad result when executing "az ' + command + '":' + output));case 11:_context3.next = 14;break;case 13:throw (


                                    new Error('No output when executing "az ' + command + '"'));case 14:case 'end':return _context3.stop();}}}, _callee3, this, [[4, 8]]);}));function execResultJsonWithoutError(_x3, _x4) {return _ref3.apply(this, arguments);}return execResultJsonWithoutError;}() }, { key: 'execNoOutput', value: function execNoOutput(



        command, timeout) {
            return util.execStdout(this.location + " " + command, timeout || TIMEOUT);
        } }, { key: 'getAzureCliLocation', value: function () {var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {var location, plat, files;return _regenerator2.default.wrap(function _callee4$(_context4) {while (1) {switch (_context4.prev = _context4.next) {case 0:


                                location = void 0;_context4.prev = 1;_context4.next = 4;return (

                                    util.findExecutive("az"));case 4:location = _context4.sent;_context4.next = 10;break;case 7:_context4.prev = 7;_context4.t0 = _context4['catch'](1);

                                location = null;case 10:


                                if (location && !_fsPlus2.default.isFileSync(location)) {
                                    plat = _os2.default.platform();
                                    if (plat === "win32") {
                                        location = process.env['APPDATA'] + '\\Python\\Scripts\\az.bat';
                                        if (!_fsPlus2.default.isFileSync(location)) {
                                            files = _glob2.default.sync((process.env['APPDATA'] + '/Python/Python*/Scripts/az.bat').replace(/\\/g, '/'));
                                            if (files && files.length) {
                                                location = files[0];
                                            }
                                        }
                                    } else if (plat === 'darwin') {
                                        location = '/usr/local/bin/az';
                                    }
                                    //ToDo: Add advanced features to get az full path for linux and osx
                                }if (!(

                                location && _fsPlus2.default.isFileSync(location))) {_context4.next = 14;break;}
                                this.location = util.cstr(location);return _context4.abrupt('return',
                                location);case 14:case 'end':return _context4.stop();}}}, _callee4, this, [[1, 7]]);}));function getAzureCliLocation() {return _ref4.apply(this, arguments);}return getAzureCliLocation;}() }]);return AzureCli;}();exports.default = AzureCli;