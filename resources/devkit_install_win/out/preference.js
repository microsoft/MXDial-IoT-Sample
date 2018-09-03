'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _stringify = require('babel-runtime/core-js/json/stringify');var _stringify2 = _interopRequireDefault(_stringify);exports.


















getValue = getValue;exports.





setValue = setValue;exports.










savePreference = savePreference;var _fsPlus = require('fs-plus');var _fsPlus2 = _interopRequireDefault(_fsPlus);var _lodash = require('lodash');var _lodash2 = _interopRequireDefault(_lodash);var _path = require('path');var _path2 = _interopRequireDefault(_path);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var preferenceFile = void 0;var pref = void 0;function loadPreference() {preferenceFile = _path2.default.join(_fsPlus2.default.getHomeDirectory(), '.azure_iot_pref.json');if (_fsPlus2.default.isFileSync(preferenceFile)) {try {pref = JSON.parse(_fsPlus2.default.readFileSync(preferenceFile, 'utf-8'));} catch (err) {pref = {};}} else {pref = {};}}function getValue(key) {if (!_lodash2.default.isString(key)) {throw new Error("Preference key must be string.");}return pref[key];}function setValue(key, value) {if (!_lodash2.default.isString(key)) {throw new Error("Preference key must be string.");}if (_lodash2.default.isNull(value) || _lodash2.default.isString(value) || _lodash2.default.isNumber(value) || _lodash2.default.isUndefined(value)) {pref[key] = value;} else {throw new Error("Preference value must be simple type.");}}function savePreference() {
    preferenceFile = _path2.default.join(_fsPlus2.default.getHomeDirectory(), '.azure_iot_pref.json');
    _fsPlus2.default.writeFileSync(preferenceFile, (0, _stringify2.default)(pref, null, 4));
}

loadPreference();