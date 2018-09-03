'use strict';var _regenerator = require('babel-runtime/regenerator');var _regenerator2 = _interopRequireDefault(_regenerator);var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);var _util = require('../util');var util = _interopRequireWildcard(_util);
var _telemetry = require('../telemetry');var telemetry = _interopRequireWildcard(_telemetry);function _interopRequireWildcard(obj) {if (obj && obj.__esModule) {return obj;} else {var newObj = {};if (obj != null) {for (var key in obj) {if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];}}newObj.default = obj;return newObj;}}function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

exports.default = {
    name: "check Node.js version",
    run: function () {var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(context) {return _regenerator2.default.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:_context.prev = 0;_context.next = 3;return (

                                util.execStdout("node --version"));case 3:return _context.abrupt('return', _context.sent.trim());case 6:_context.prev = 6;_context.t0 = _context['catch'](0);_context.next = 10;return (

                                telemetry.trace('Task check Node.js version failed: missing Node.js executable'));case 10:throw (
                                new Error("Missing Node.js executable, please install Node.js, if already installed make sure it can be reached from current environment."));case 11:case 'end':return _context.stop();}}}, _callee, undefined, [[0, 6]]);}));return function run(_x) {return _ref.apply(this, arguments);};}() };