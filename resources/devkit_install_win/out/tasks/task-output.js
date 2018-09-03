'use strict';var _regenerator = require('babel-runtime/regenerator');var _regenerator2 = _interopRequireDefault(_regenerator);var _stringify = require('babel-runtime/core-js/json/stringify');var _stringify2 = _interopRequireDefault(_stringify);var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);var _fsPlus = require('fs-plus');var _fsPlus2 = _interopRequireDefault(_fsPlus);
var _path = require('path');var _path2 = _interopRequireDefault(_path);
var _lodash = require('lodash');var _lodash2 = _interopRequireDefault(_lodash);
var _mkdirp = require('mkdirp');var _mkdirp2 = _interopRequireDefault(_mkdirp);
var _telemetry = require('../telemetry');var telemetry = _interopRequireWildcard(_telemetry);function _interopRequireWildcard(obj) {if (obj && obj.__esModule) {return obj;} else {var newObj = {};if (obj != null) {for (var key in obj) {if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];}}newObj.default = obj;return newObj;}}function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

var run = function () {var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(context) {var outputFile;return _regenerator2.default.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:if (!(
                        context.arduino_project && context.output && _lodash2.default.keys(context.output))) {_context.next = 7;break;}
                        _mkdirp2.default.sync(_path2.default.join(context.arduino_project.rootFolder, '.build'));
                        outputFile = _path2.default.join(context.arduino_project.rootFolder, '.build', 'runtime.json');
                        _fsPlus2.default.writeFileSync(outputFile, (0, _stringify2.default)(context.output, null, 4));_context.next = 6;return (
                            telemetry.trace('task provision->succeeded'));case 6:return _context.abrupt('return',
                        outputFile);case 7:case 'end':return _context.stop();}}}, _callee, undefined);}));return function run(_x) {return _ref.apply(this, arguments);};}();


exports.default = {
    name: "output",
    run: run };