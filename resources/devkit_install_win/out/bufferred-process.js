'use strict';Object.defineProperty(exports, "__esModule", { value: true });exports.default = undefined;var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);var _promise = require('babel-runtime/core-js/promise');var _promise2 = _interopRequireDefault(_promise);var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);var _createClass2 = require('babel-runtime/helpers/createClass');var _createClass3 = _interopRequireDefault(_createClass2);var _child_process = require('child_process');var _child_process2 = _interopRequireDefault(_child_process);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var

BufferedProcess = function () {
    function BufferedProcess(arg) {(0, _classCallCheck3.default)(this, BufferedProcess);
        this.command = arg.command;
        this.args = arg.args;
        var emptyFunc = function emptyFunc() {};
        this.stdout = arg.stdout || emptyFunc;
        this.stderr = arg.stderr || emptyFunc;
        this.exit = arg.exit || emptyFunc;
        this.partialLine = { err: '', out: '' };
    }(0, _createClass3.default)(BufferedProcess, [{ key: 'spawn', value: function spawn()
        {var _this = this;
            return new _promise2.default(function (resolve, reject) {
                console.log([_this.command].concat((0, _toConsumableArray3.default)(_this.args)).join(' '));
                _this.process = _child_process2.default.spawn(_this.command, _this.args);
                _this.process.stderr.on('data', function (data) {
                    return _this._stdio(data, 'err');
                });
                _this.process.stdout.on('data', function (data) {
                    return _this._stdio(data, 'out');
                });


                var error = void 0,ok = function ok() {
                    _this.process.removeListener('error', error);
                    return resolve(_this);
                };

                error = function error(err) {
                    _this.process.removeListener('data', ok);
                    return reject(err);
                };
                _this.process.stderr.once('data', ok);
                _this.process.stdout.once('data', ok);
                _this.process.once('error', error);
                _this.exitPromise = new _promise2.default(function (exitResolve) {
                    _this.process.on('exit', function (code) {
                        exitResolve(code);
                        _this.exit(code);
                    });
                });

            });
        } }, { key: 'stdin', value: function stdin(

        line) {
            return this.process.stdin.write(line + '\n');
        } }, { key: 'kill', value: function kill(

        signal) {
            this.process.kill(signal);
            return this.exitPromise;
        } }, { key: '_stdio', value: function _stdio(

        data, channel) {
            var i = void 0,len = void 0,line = void 0,lines = void 0;
            data = this.partialLine[channel] + data.toString();
            lines = data.replace(/(\r|\n)+/g, '\n').split('\n');
            this.partialLine[channel] = lines.slice(-1);
            lines = lines.slice(0, -1);
            for (i = 0, len = lines.length; i < len; i++) {
                line = lines[i];
                channel === 'err' ? this.stderr(line) : this.stdout(line);
            }
        } }]);return BufferedProcess;}();exports.default = BufferedProcess;