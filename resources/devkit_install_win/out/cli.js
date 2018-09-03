'use strict';var _setImmediate2 = require('babel-runtime/core-js/set-immediate');var _setImmediate3 = _interopRequireDefault(_setImmediate2);var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);var _extends2 = require('babel-runtime/helpers/extends');var _extends3 = _interopRequireDefault(_extends2);var _getIterator2 = require('babel-runtime/core-js/get-iterator');var _getIterator3 = _interopRequireDefault(_getIterator2);var _regenerator = require('babel-runtime/regenerator');var _regenerator2 = _interopRequireDefault(_regenerator);var _promise = require('babel-runtime/core-js/promise');var _promise2 = _interopRequireDefault(_promise);var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);var _fsPlus = require('fs-plus');var _fsPlus2 = _interopRequireDefault(_fsPlus);
var _path = require('path');var _path2 = _interopRequireDefault(_path);
var _lodash = require('lodash');var _lodash2 = _interopRequireDefault(_lodash);
var _os = require('os');var _os2 = _interopRequireDefault(_os);
var _gulp = require('gulp');var _gulp2 = _interopRequireDefault(_gulp);
var _chalk = require('chalk');var _chalk2 = _interopRequireDefault(_chalk);
var _prettyHrtime = require('pretty-hrtime');var _prettyHrtime2 = _interopRequireDefault(_prettyHrtime);
var _gulpUtil = require('gulp-util');var _gulpUtil2 = _interopRequireDefault(_gulpUtil);
var _cliSpinner = require('cli-spinner');
var _eventKit = require('event-kit');
var _colorOutput = require('./color-output');
var _runSequence = require('run-sequence');var _runSequence2 = _interopRequireDefault(_runSequence);
var _telemetry = require('./telemetry');var telemetry = _interopRequireWildcard(_telemetry);function _interopRequireWildcard(obj) {if (obj && obj.__esModule) {return obj;} else {var newObj = {};if (obj != null) {for (var key in obj) {if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];}}newObj.default = obj;return newObj;}}function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

var plat = _os2.default.platform();
var runSequence = _runSequence2.default.use(_gulp2.default);

var formatError = function formatError(e) {
    if (!e.err) {
        return e.message;
    }

    // PluginError
    if (typeof e.err.showStack === 'boolean') {
        return e.err.toString();
    }

    // Normal error
    if (e.err.stack) {
        return e.err.stack;
    }

    // Unknown (string, number, etc.)
    return new Error(String(e.err)).stack;
};
var logEvents = function logEvents(gulpInst) {
    gulpInst.on('task_start', function (e) {
    });

    gulpInst.on('task_stop', function (e) {
    });

    gulpInst.on('task_err', function (e) {
        // const msg = formatError(e);
        //const time = prettyTime(e.hrDuration);
        //gutil.log(`'${chalk.cyan(e.task)}' ${chalk.red('errored after')} ${chalk.magenta(time)}`);
        // gutil.log(msg);
    });

    gulpInst.on('task_not_found', function (err) {
        _gulpUtil2.default.log(
        _chalk2.default.red('Task \'' + err.task + '\' is not in your gulpfile'));

        _gulpUtil2.default.log('Please check the documentation for proper gulpfile formatting');
        process.exit(1);
    });
};

logEvents(_gulp2.default);

var spinner = new _cliSpinner.Spinner();

var _tasks = [];

var _context =
{
    spinner: spinner };

var _executeTaskAsync = function () {var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(_task, cb) {var success, result, fmt, _fmt;return _regenerator2.default.wrap(function _callee$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:
                        success = false;
                        result = void 0;_context2.prev = 2;

                        fmt = (0, _colorOutput.color)('pending', '  - %s');
                        console.log(fmt, 'Checking pre-conditions of task: ' + _task.name);_context2.next = 7;return (
                            _promise2.default.resolve(_task.run(_context)));case 7:result = _context2.sent;
                        success = true;_context2.next = 14;break;case 11:_context2.prev = 11;_context2.t0 = _context2['catch'](2);

                        //console.log('got error', result);
                        result = _context2.t0.message;case 14:

                        if (success) {
                            _fmt = (0, _colorOutput.color)('checkmark', '  ' + _colorOutput.symbols.ok) +
                            (0, _colorOutput.color)('green', ' %s: ') +
                            (0, _colorOutput.color)('bright pass', '%s');
                            console.log(_fmt, _task.name, result);
                            cb();
                        } else {
                            cb(result);
                        }case 15:case 'end':return _context2.stop();}}}, _callee, undefined, [[2, 11]]);}));return function _executeTaskAsync(_x, _x2) {return _ref.apply(this, arguments);};}();


var registerTask = function registerTask(name) {
    var fmt = (0, _colorOutput.color)('bright fail', '  ' + _colorOutput.symbols.err) +
    (0, _colorOutput.color)('bright fail', ' %s: ') +
    (0, _colorOutput.color)('bright yellow', '%s');

    if (_lodash2.default.isString(name)) {
        _tasks.push(name);
        _gulp2.default.task(name, function (cb) {
            var _task = require('./tasks/task-' + name).default;
            _executeTaskAsync(_task, cb).catch(function (error) {
                console.error(fmt, name, error);
            });
        });
    } else {
        var obj = name;

        _lodash2.default.each(obj, function (value, key) {
            if (!Array.isArray(value)) {
                value = [value];
            }
            _lodash2.default.each(value, function (name) {
                _tasks.push(key + ":" + name);
                _gulp2.default.task(key + ":" + name, function (cb) {
                    var _task = require('./tasks/task-' + key)[name];
                    _executeTaskAsync(_task, cb).catch(function (error) {
                        console.error(fmt, name, error);
                    });
                });
            });
        });
    }
};


var registerTasks = function registerTasks() {for (var _len = arguments.length, tasks = Array(_len), _key = 0; _key < _len; _key++) {tasks[_key] = arguments[_key];}var _iteratorNormalCompletion = true;var _didIteratorError = false;var _iteratorError = undefined;try {
        for (var _iterator = (0, _getIterator3.default)(tasks), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {var task = _step.value;
            registerTask(task);
        }} catch (err) {_didIteratorError = true;_iteratorError = err;} finally {try {if (!_iteratorNormalCompletion && _iterator.return) {_iterator.return();}} finally {if (_didIteratorError) {throw _iteratorError;}}}
};

var action = process.argv.slice(2)[0];
var targetFolder = process.argv.slice(3)[0];

if (action === 'build') {
    telemetry.trace('running task: build');
    var defaultJson = {
        "sketch": "app.ino",
        "board": "AZ3166:stm32f4:MXCHIP_AZ3166" };

    var settings = (0, _extends3.default)({}, defaultJson, JSON.parse(_fsPlus2.default.readFileSync(_path2.default.join(targetFolder, 'config.json'))));
    settings.sketch = _path2.default.resolve(_path2.default.join(targetFolder, settings.sketch));
    _context.arduino_project = {
        rootFolder: _path2.default.dirname(settings.sketch),
        settings: settings };

    if (!settings.config || _fsPlus2.default.isFileSync(_path2.default.join(_context.arduino_project.rootFolder, '.build', 'runtime.json'))) {
        if (settings.config) {
            _context.arduino_project.settings.config_data = JSON.parse(_fsPlus2.default.readFileSync(_path2.default.join(_context.arduino_project.rootFolder, '.build', 'runtime.json'), 'utf-8'));
            _context.iothub = _context.arduino_project.settings.config_data["iotHubName"];
        }
        registerTasks('nodejs', 'generateplatformlocal', { 'config': ['config_connect_string'] }, { 'arduinoide': ["checkArduinoIde", "checkBoard", "build_upload"] });

    } else {
        throw new Error("Please run provision task first.");
    }
} else if (action === 'provision') {
    telemetry.trace('running task: provision');
    var _settings = JSON.parse(_fsPlus2.default.readFileSync(_path2.default.join(targetFolder, 'config.json')));
    var templateFile = _path2.default.join(targetFolder, 'azuredeploy.json');
    _settings.sketch = _path2.default.resolve(_path2.default.join(targetFolder, _settings.sketch));
    _context.arduino_project = {
        rootFolder: _path2.default.dirname(_settings.sketch),
        settings: _settings,
        templateFile: templateFile };


    // Register tasks from specific scenarios
    var provisionTasks = _context.arduino_project.settings.tasks.provision;

    registerTasks.apply(undefined, ['nodejs', 'azurecliversioncheck'].concat((0, _toConsumableArray3.default)(provisionTasks), ['output']));
} else if (action === 'config_wifi') {
    telemetry.trace("running task: config_wifi");
    registerTasks({ 'config': ['config_wifi'] });
} else if (action === 'config_device_connection_string') {
    telemetry.trace("running task: config_device_connection_string");
    var _settings2 = JSON.parse(_fsPlus2.default.readFileSync(_path2.default.join(targetFolder, 'config.json')));
    _settings2.sketch = _path2.default.resolve(_path2.default.join(targetFolder, _settings2.sketch));
    _context.arduino_project = {
        rootFolder: _path2.default.dirname(_settings2.sketch),
        settings: _settings2 };

    registerTasks({ 'config': ['config_device_connection_string'] });
} else if (action === 'deploy') {
    spinner.start();
    telemetry.trace('running task: deploy');
    var _settings3 = JSON.parse(_fsPlus2.default.readFileSync(_path2.default.join(targetFolder, 'config.json')));
    _settings3.sketch = _path2.default.resolve(_path2.default.join(targetFolder, _settings3.sketch));
    _context.arduino_project = {
        rootFolder: _path2.default.dirname(_settings3.sketch),
        settings: _settings3 };


    if (!_fsPlus2.default.isFileSync(_path2.default.join(_context.arduino_project.rootFolder, '.build', 'runtime.json'))) {
        throw new Error("Please run provision task first.");
    }

    var deployTasks = _context.arduino_project.settings.tasks.deploy;
    registerTasks.apply(undefined, (0, _toConsumableArray3.default)(deployTasks));
} else if (action === 'installation') {
    spinner.start();
    telemetry.trace('running task: install');
    registerTasks({ 'installation':
        [
        'installCli',
        'installArduino',
        'installSTLink',
        'setBoardUrl',
        'installBoardPackage',
        'installVsCode',
        'installArduinoExtension'] },

    'generateplatformlocal', 'checkarduinopackage');
}

(0, _setImmediate3.default)(function () {
    runSequence.apply(undefined, _tasks.concat([function () {
        if (spinner.isSpinning()) {
            spinner.stop(true);
        }
    }]));
});