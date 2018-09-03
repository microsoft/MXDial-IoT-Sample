'use strict';Object.defineProperty(exports, "__esModule", { value: true });exports.findExecutive = exports.executeWithProgress = exports.timeout = exports.cstr = undefined;var _getIterator2 = require('babel-runtime/core-js/get-iterator');var _getIterator3 = _interopRequireDefault(_getIterator2);var _regenerator = require('babel-runtime/regenerator');var _regenerator2 = _interopRequireDefault(_regenerator);var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);var _promise = require('babel-runtime/core-js/promise');var _promise2 = _interopRequireDefault(_promise);var executeWithProgress = exports.executeWithProgress = function () {var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(
































































































    function _callee(command, args, outFunc) {var bp;return _regenerator2.default.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:
                        bp = new _bufferredProcess2.default({
                            command: command,
                            args: args || [],
                            stdout: function stdout(data) {
                                outFunc(data, 'stdout');
                            },
                            stderr: function stderr(data) {
                                outFunc(data, 'stderr');
                            },
                            exit: function exit(code) {
                                if (code === 0) {
                                    outFunc(_path2.default.basename(command) + ' exited.', 'stdout');
                                } else
                                outFunc(_path2.default.basename(command) + ' exited with error code ' + code + '.', 'stderr');
                            } });_context.next = 3;return (

                            bp.spawn());case 3:return _context.abrupt('return',
                        bp.exitPromise);case 4:case 'end':return _context.stop();}}}, _callee, this);}));return function executeWithProgress(_x, _x2, _x3) {return _ref.apply(this, arguments);};}();var isShebang = function () {var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(

    function _callee2(file) {return _regenerator2.default.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:return _context2.abrupt('return',
                        new _promise2.default(function (resolve, reject) {
                            _fsPlus2.default.open(file, 'r', function (err, fd) {
                                if (err) {
                                    return reject(err);
                                }

                                _fsPlus2.default.read(fd, new Buffer(2), 0, 2, 0, function (err, bytesRead, buf) {
                                    if (err) {
                                        return reject(err);
                                    } else {
                                        resolve(bytesRead >= 2 && buf.readUInt8(0) === 0x23 /*'#'*/ &&
                                        buf.readUInt8(1) === 0x21 /*'!'*/);
                                    }
                                });
                            });
                        }));case 1:case 'end':return _context2.stop();}}}, _callee2, this);}));return function isShebang(_x4) {return _ref2.apply(this, arguments);};}();var findExecutive = exports.findExecutive = function () {var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(


    function _callee3(command) {var platform, executiveList, isWin32, list, location, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, executiveFile, shebang;return _regenerator2.default.wrap(function _callee3$(_context3) {while (1) {switch (_context3.prev = _context3.next) {case 0:
                        platform = _os2.default.platform();
                        executiveList = [];
                        isWin32 = false;if (!(
                        platform === "win32")) {_context3.next = 17;break;}_context3.prev = 4;_context3.next = 7;return (

                            execStdout("where " + command));case 7:list = _context3.sent.trim().split('\n');
                        executiveList = _lodash2.default.map(list, function (l) {return l.trim();});
                        isWin32 = true;_context3.next = 15;break;case 12:_context3.prev = 12;_context3.t0 = _context3['catch'](4);return _context3.abrupt('return',

                        undefined);case 15:_context3.next = 23;break;case 17:_context3.t1 = _path2.default;_context3.next = 20;return (


                            execStdout('which ' + command));case 20:_context3.t2 = _context3.sent;location = _context3.t1.resolve.call(_context3.t1, _context3.t2).trim();
                        if (_fsPlus2.default.isSymbolicLinkSync(location)) {
                            executiveList.push(_fsPlus2.default.realpathSync(location));
                        } else if (_fsPlus2.default.isFileSync(location)) {
                            executiveList.push(location);
                        }case 23:_iteratorNormalCompletion = true;_didIteratorError = false;_iteratorError = undefined;_context3.prev = 26;_iterator = (0, _getIterator3.default)(

                        executiveList);case 28:if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {_context3.next = 40;break;}executiveFile = _step.value;_context3.next = 32;return (
                            isShebang(executiveFile));case 32:shebang = _context3.sent;if (!(
                        shebang && !isWin32)) {_context3.next = 35;break;}return _context3.abrupt('return', executiveFile);case 35:if (!(
                        !shebang && isWin32)) {_context3.next = 37;break;}return _context3.abrupt('return', executiveFile);case 37:_iteratorNormalCompletion = true;_context3.next = 28;break;case 40:_context3.next = 46;break;case 42:_context3.prev = 42;_context3.t3 = _context3['catch'](26);_didIteratorError = true;_iteratorError = _context3.t3;case 46:_context3.prev = 46;_context3.prev = 47;if (!_iteratorNormalCompletion && _iterator.return) {_iterator.return();}case 49:_context3.prev = 49;if (!_didIteratorError) {_context3.next = 52;break;}throw _iteratorError;case 52:return _context3.finish(49);case 53:return _context3.finish(46);case 54:return _context3.abrupt('return',

                        executiveList[0]);case 55:case 'end':return _context3.stop();}}}, _callee3, this, [[4, 12], [26, 42, 46, 54], [47,, 49, 53]]);}));return function findExecutive(_x5) {return _ref3.apply(this, arguments);};}();

// findExecutive('apt').catch(console.log).then(data => console.log(data));
exports.exec = exec;exports.execShort = execShort;exports.execStdoutWithoutError = execStdoutWithoutError;exports.execStdout = execStdout;exports.execStderr = execStderr;exports.
isWin32X64 = isWin32X64;var _bufferredProcess = require('./bufferred-process');var _bufferredProcess2 = _interopRequireDefault(_bufferredProcess);var _fsPlus = require('fs-plus');var _fsPlus2 = _interopRequireDefault(_fsPlus);var _path = require('path');var _path2 = _interopRequireDefault(_path);var _lodash = require('lodash');var _lodash2 = _interopRequireDefault(_lodash);var _os = require('os');var _os2 = _interopRequireDefault(_os);var _child_process = require('child_process');var _child_process2 = _interopRequireDefault(_child_process);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var cstr = exports.cstr = function cstr(s) {var c = void 0,esc = void 0,i = void 0,len = void 0;esc = '';for (i = 0, len = s.length; i < len; i++) {c = s[i];switch (c) {case '"':c = '\\"';break;case '\\':c = '\\\\';}esc += c;}return "\"" + esc + "\"";};var timeout = exports.timeout = function timeout(ms) {return new _promise2.default(function (resolve) {return setTimeout(resolve, ms);});};function exec(command) {try {var _process = _child_process2.default.exec(command, { encoding: "utf8" });var _stdout = [];var _stderr = [];_process.stdout.on('data', function (data) {_stdout.push(data);});_process.stderr.on('data', function (data) {_stderr.push(data);});return new _promise2.default(function (resolve, reject) {_process.on('exit', function (code) {if (code === 0) {resolve({ sucess: true, stdout: _stdout.join(''), stderr: _stderr.join('') });} else {reject({ stdout: _stdout.join(''), stderr: _stderr.join('') });}});});} catch (error) {throw new Error('failed to execute ' + command);}}function execShort(command, timeout) {return new _promise2.default(function (resolve, reject) {_child_process2.default.exec(command, { encoding: 'utf8', timeout: timeout || 1000 * 10 }, function (error, stdout, stderr) {if (error) {reject(error);} else {resolve({ stderr: stderr, stdout: stdout });}});});}function execStdoutWithoutError(command, timeout) {return execShort(command, timeout).then(function (result) {return result.stdout;}, function (error) {console.error('Unexpected error when executing ' + command + ' : ' + error.message + '. ' + error.stack);});}function execStdout(command, timeout) {return execShort(command, timeout).then(function (result) {return result.stdout;}, function (error) {throw new Error('Unexpected error when executing ' + command + ' : ' + error.message + '. ' + error.stack);});}function execStderr(command, timeout) {return execShort(command, timeout).then(function (result) {return result.stderr;}, function (error) {throw new Error('Unexpected error when executing ' + command + ' : ' + error.message + '. ' + error.stack);});}function isWin32X64() {
    return _os2.default.platform() === 'win32' && (process.arch === 'x64' || process.env.hasOwnProperty('PROCESSOR_ARCHITEW6432'));
}