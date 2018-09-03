'use strict';var _tty = require('tty');var _tty2 = _interopRequireDefault(_tty);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

exports.symbols = {
    ok: 'V',
    err: 'X',
    dot: '․',
    comma: ',',
    bang: '!' };

exports.colors = {
    pass: 90,
    fail: 31,
    'bright pass': 92,
    'bright fail': 91,
    'bright yellow': 93,
    pending: 36,
    suite: 0,
    'error title': 0,
    'error message': 31,
    'error stack': 90,
    checkmark: 32,
    fast: 90,
    medium: 33,
    slow: 31,
    green: 32,
    light: 90,
    'diff gutter': 90,
    'diff added': 32,
    'diff removed': 31 };

// With node.js on Windows: use symbols available in terminal default fonts
if (process.platform === 'win32') {
    exports.symbols.ok = 'V';
    exports.symbols.err = 'X';
    exports.symbols.dot = '.';
}
exports.color = function (type, str) {
    return '\x1B[' + exports.colors[type] + 'm' + str + '\x1B[0m';
};


exports.cursor = {
    hide: function hide() {
        isatty && process.stdout.write('\x1B[?25l');
    },

    show: function show() {
        isatty && process.stdout.write('\x1B[?25h');
    },

    deleteLine: function deleteLine() {
        isatty && process.stdout.write('\x1B[2K');
    },

    beginningOfLine: function beginningOfLine() {
        isatty && process.stdout.write('\x1B[0G');
    },

    CR: function CR() {
        if (isatty) {
            exports.cursor.deleteLine();
            exports.cursor.beginningOfLine();
        } else {
            process.stdout.write('\r');
        }
    } };


var isatty = _tty2.default.isatty(1) && _tty2.default.isatty(2);
exports.window = {
    width: 75 };


if (isatty) {
    exports.window.width = process.stdout.getWindowSize ?
    process.stdout.getWindowSize(1)[0] :
    _tty2.default.getWindowSize()[1];
}