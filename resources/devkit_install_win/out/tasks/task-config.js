'use strict';var _regenerator = require('babel-runtime/regenerator');var _regenerator2 = _interopRequireDefault(_regenerator);var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);var _promise = require('babel-runtime/core-js/promise');var _promise2 = _interopRequireDefault(_promise);var _preference = require('../preference');var pref = _interopRequireWildcard(_preference);
var _telemetry = require('../telemetry');var telemetry = _interopRequireWildcard(_telemetry);
var _util = require('../util');var util = _interopRequireWildcard(_util);
var _lodash = require('lodash');var _lodash2 = _interopRequireDefault(_lodash);
var _constants = require('../constants');var _constants2 = _interopRequireDefault(_constants);
var _fsPlus = require('fs-plus');var _fsPlus2 = _interopRequireDefault(_fsPlus);
var _inquirer = require('inquirer');var _inquirer2 = _interopRequireDefault(_inquirer);
var _os = require('os');var _os2 = _interopRequireDefault(_os);
var _path = require('path');var _path2 = _interopRequireDefault(_path);
var _serialport = require('serialport');var _serialport2 = _interopRequireDefault(_serialport);function _interopRequireWildcard(obj) {if (obj && obj.__esModule) {return obj;} else {var newObj = {};if (obj != null) {for (var key in obj) {if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];}}newObj.default = obj;return newObj;}}function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

var plat = _os2.default.platform();

var getComList = function getComList() {
    return new _promise2.default(function (resolve, reject) {
        _serialport2.default.list(function (e, list) {
            if (e) {
                reject(e);
            } else {
                resolve(list);
            }
        });
    });
};

var chooseCOM = function () {var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {var list, comPort, comPreference, comNameList, chosen;return _regenerator2.default.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:_context.t0 = _lodash2.default;_context.next = 3;return (
                            getComList());case 3:_context.t1 = _context.sent;_context.t2 = function (com) {
                            var vendorId = com.vendorId;
                            var productId = com.productId;

                            if (vendorId && productId) {
                                return vendorId === _constants2.default.AZ3166_HARDWARE_VENDORID && productId.toLowerCase() === _constants2.default.AZ3166_HARDWARE_PROJECTID;
                            }
                        };list = _context.t0.filter.call(_context.t0, _context.t1, _context.t2);if (!(

                        list && list.length)) {_context.next = 20;break;}
                        comPort = list[0].comName;if (!(
                        list.length > 1)) {_context.next = 15;break;}
                        comPreference = pref.getValue('com');
                        comNameList = _lodash2.default.map(list, 'comName');_context.next = 13;return (
                            _inquirer2.default.prompt([{
                                name: 'comName',
                                type: 'list',
                                message: 'What COM port would you like to choose?',
                                choices: _lodash2.default.flatten([
                                new _inquirer2.default.Separator('Select COM port'),
                                comNameList,
                                new _inquirer2.default.Separator('-------------------')]),

                                default: comPreference ? _lodash2.default.findIndex(comNameList, {
                                    name: comPreference }) :
                                0 }]));case 13:chosen = _context.sent;

                        if (chosen) {
                            comPort = chosen.comName;
                        }case 15:if (

                        comPort) {_context.next = 17;break;}throw (
                            new Error('No COM port.'));case 17:return _context.abrupt('return',

                        comPort);case 20:throw (

                            new Error('No AZ3166 board connected.'));case 21:case 'end':return _context.stop();}}}, _callee, undefined);}));return function chooseCOM() {return _ref.apply(this, arguments);};}();



var sendDataPromise = function sendDataPromise(port, data) {
    return new _promise2.default(function (resolve, reject) {
        try {
            port.write(data, function (err) {
                if (err) {
                    reject(err);
                } else {
                    port.drain(resolve);
                }
            });
        } catch (err) {
            reject(err);
        }
    });
};

var setDeviceConnectionString = function () {var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(connectionString) {var comPort, configMode;return _regenerator2.default.wrap(function _callee4$(_context4) {while (1) {switch (_context4.prev = _context4.next) {case 0:_context4.next = 2;return (
                            chooseCOM());case 2:comPort = _context4.sent;
                        console.log('Opening ' + comPort + '.');
                        configMode = false;return _context4.abrupt('return',

                        new _promise2.default(function (resolve, reject) {
                            try {
                                // serialport node module cannot write data to serial port on macOS,
                                // we use screen bash command as a workaround for macOS
                                // https://github.com/EmergingTechnologyAdvisors/node-serialport/issues/1324
                                if (plat === 'darwin') {
                                    var gotData = false;
                                    // close the serial port opened by serialport node module,
                                    // we will use screen instead
                                    var data = 'set_az_iothub "' + connectionString + '"\\r\\n';
                                    var flushConnectString = function () {var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {var commands;return _regenerator2.default.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:
                                                            commands = [];
                                                            if (data.length > 120) {
                                                                commands.push('screen -S devkit -p 0 -X stuff $\'' + data.substr(0, 120) + '\\n\'');
                                                                commands.push('sleep 1');
                                                                commands.push('screen -S devkit -p 0 -X stuff $\'' + data.substr(120) + '\'');
                                                            } else {
                                                                commands.push('screen -S devkit -p 0 -X stuff $\'' + data + '\'');
                                                            }
                                                            // destory the screen session and release serial port
                                                            commands.push('screen -X -S devkit quit');
                                                            commands.push('rm -f screenlog.*');
                                                            commands = commands.join(' && ');
                                                            util.execStdout(commands).then(function () {
                                                                telemetry.trace('Config IoT Hub Device connection string succeeded.');
                                                                resolve('done');
                                                            });case 6:case 'end':return _context2.stop();}}}, _callee2, undefined);}));return function flushConnectString() {return _ref3.apply(this, arguments);};}();


                                    // create a detached screen and name it as devkit
                                    util.execStdout('rm -f screenlog.* && screen -dmSL devkit ' + comPort + ' ' + _constants2.default.DEFAULT_BAUD_RATE + ' && sleep 1').then(function () {
                                        if (!_fsPlus2.default.existsSync('screenlog.0')) {
                                            util.execStdout('screen -X -S devkit quit').then(function () {
                                                reject('Cannot open serial port ' + comPort);
                                            });
                                            return;
                                        }

                                        var logs = _fsPlus2.default.readFileSync('screenlog.0', 'utf-8');
                                        if (logs.includes('set_')) {
                                            configMode = true;
                                            flushConnectString().then(resolve);
                                        } else {
                                            configMode = false;
                                            _fsPlus2.default.watchFile('screenlog.0', function (curr, prev) {
                                                logs = _fsPlus2.default.readFileSync('screenlog.0', 'utf-8');
                                                gotData = true;

                                                if (logs.includes('set_')) {
                                                    _fsPlus2.default.unwatchFile('screenlog.0');
                                                    configMode = true;
                                                    flushConnectString().then(resolve);
                                                } else {
                                                    configMode = false;
                                                }
                                            });
                                        }
                                    });

                                    setTimeout(function () {
                                        if (!gotData || !configMode) {
                                            console.log(_constants2.default.CONFIGURATION_MODE_PROMPT);
                                        }
                                    }, 20000);
                                } else {
                                    var errorRejected = false;
                                    var commandExecuted = false;
                                    var _gotData = false;
                                    var port = new _serialport2.default(comPort, {
                                        baudRate: _constants2.default.DEFAULT_BAUD_RATE,
                                        dataBits: 8,
                                        stopBits: 1,
                                        xon: false,
                                        xoff: false,
                                        parity: 'none' });

                                    var rejectIfErr = function rejectIfErr(err) {
                                        if (errorRejected) return true;
                                        if (err) {
                                            errorRejected = true;
                                            reject(err);
                                            try {
                                                port.close();
                                            } catch (ignore) {}
                                            return true;
                                        }
                                    };

                                    var _flushConnectString = function () {var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {var _data;return _regenerator2.default.wrap(function _callee3$(_context3) {while (1) {switch (_context3.prev = _context3.next) {case 0:_context3.prev = 0;

                                                            _data = 'set_az_iothub "' + connectionString + '"\r\n';_context3.next = 4;return (
                                                                sendDataPromise(port, _data.slice(0, 120)));case 4:if (!(
                                                            _data.length > 120)) {_context3.next = 9;break;}_context3.next = 7;return (
                                                                util.timeout(1000));case 7:_context3.next = 9;return (
                                                                sendDataPromise(port, _data.slice(120)));case 9:_context3.next = 11;return (

                                                                util.timeout(1000));case 11:
                                                            port.close();_context3.next = 16;break;case 14:_context3.prev = 14;_context3.t0 = _context3['catch'](0);case 16:if (!

                                                            errorRejected) {_context3.next = 18;break;}return _context3.abrupt('return');case 18:
                                                            telemetry.trace('Config IoT Hub Device connection succeeded.');
                                                            resolve('done');case 20:case 'end':return _context3.stop();}}}, _callee3, undefined, [[0, 14]]);}));return function _flushConnectString() {return _ref4.apply(this, arguments);};}();

                                    port.on('open', function (err) {
                                        if (rejectIfErr(err)) return;
                                        port.write('\r\nhelp\r\n', function (err) {
                                            if (rejectIfErr(err)) return;
                                        });
                                    });
                                    port.on('data', function (data) {
                                        _gotData = true;
                                        var output = data.toString().trim();

                                        if (commandExecuted) return;
                                        if (output.includes('set_')) {
                                            commandExecuted = true;
                                            configMode = true;
                                            _flushConnectString().then(resolve).catch(reject);
                                        } else {
                                            configMode = false;
                                        }
                                        if (configMode) {
                                            _lodash2.default.each(output.split('\n'), function (line) {
                                                if (line) {
                                                    line = _lodash2.default.trimStart(line.trim(), '#').trim();
                                                    if (line && line.length) {
                                                        console.log('SerialOutput', line);
                                                    }
                                                }
                                            });
                                        }
                                    });
                                    port.on('error', function (err) {
                                        if (errorRejected) return;
                                        console.log(err);
                                        rejectIfErr(err);
                                    });
                                    setTimeout(function () {
                                        if (errorRejected) return;
                                        if (!_gotData || !configMode) {
                                            console.log(_constants2.default.CONFIGURATION_MODE_PROMPT);
                                            port.write('\r\nhelp\r\n', function (err) {
                                                rejectIfErr(err);
                                            });
                                        }
                                    }, 10000);
                                }
                            } catch (err) {
                                console.log('Open serial port error:' + err);
                            }
                        }));case 6:case 'end':return _context4.stop();}}}, _callee4, undefined);}));return function setDeviceConnectionString(_x) {return _ref2.apply(this, arguments);};}();


exports.config_connect_string = {
    name: 'Config azure connection string',
    run: function () {var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(context) {var connectionStringKey, settings, connectionString;return _regenerator2.default.wrap(function _callee5$(_context5) {while (1) {switch (_context5.prev = _context5.next) {case 0:_context5.prev = 0;if (!(

                            context.arduino_project && context.arduino_project.settings && context.arduino_project.settings.config)) {_context5.next = 14;break;}
                            connectionStringKey = context.arduino_project.settings.config;
                            settings = context.arduino_project.settings;if (!(
                            settings.config_data && settings.config_data[connectionStringKey])) {_context5.next = 11;break;}
                            connectionString = settings.config_data[connectionStringKey];_context5.next = 8;return (
                                setDeviceConnectionString(connectionString));case 8:return _context5.abrupt('return', _context5.sent);case 11:throw (

                                new Error('Cannot get connection string, please run provision task first.'));case 12:_context5.next = 15;break;case 14:return _context5.abrupt('return',


                            'ignore');case 15:_context5.next = 23;break;case 17:_context5.prev = 17;_context5.t0 = _context5['catch'](0);


                            console.error(_context5.t0);_context5.next = 22;return (
                                telemetry.trace('Config IoT Hub device connection string failed: ' + _context5.t0.message));case 22:throw (
                                new Error('Config IoT Hub device connection string failed: ' + _context5.t0.message));case 23:case 'end':return _context5.stop();}}}, _callee5, undefined, [[0, 17]]);}));return function run(_x2) {return _ref5.apply(this, arguments);};}() };




exports.config_device_connection_string = {
    name: 'Config IoT Hub device connection string',
    run: function () {var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(context) {var inputConnectionString, hostName, deviceId, connectionStringKey, settings, runtimeJsonFilePath, config_data, hostnameMatches, deviceIDMatches, result, connectionString, _result;return _regenerator2.default.wrap(function _callee6$(_context6) {while (1) {switch (_context6.prev = _context6.next) {case 0:
                            inputConnectionString = '';
                            hostName = '';
                            deviceId = '';_context6.prev = 3;


                            if (context.arduino_project && context.arduino_project.settings && context.arduino_project.settings.config) {
                                connectionStringKey = context.arduino_project.settings.config;
                                settings = context.arduino_project.settings;
                                runtimeJsonFilePath = _path2.default.join(context.arduino_project.rootFolder, '.build', 'runtime.json');

                                if (_fsPlus2.default.isFileSync(runtimeJsonFilePath)) {
                                    config_data = JSON.parse(_fsPlus2.default.readFileSync(runtimeJsonFilePath, 'utf-8'));
                                    if (config_data && config_data[connectionStringKey]) {
                                        inputConnectionString = config_data[connectionStringKey];
                                        hostnameMatches = inputConnectionString.match(/HostName=(.*?)[;$]/);
                                        if (hostnameMatches) {
                                            hostName = hostnameMatches[0];
                                        }

                                        deviceIDMatches = inputConnectionString.match(/DeviceId=(.*?)[;$]/);
                                        if (deviceIDMatches) {
                                            deviceId = deviceIDMatches[0];
                                        }
                                    }
                                }
                            }_context6.next = 7;return (

                                _inquirer2.default.prompt([{
                                    name: 'choose',
                                    type: 'list',
                                    message: 'What connection string of iot device would you like to choose?',
                                    choices: _lodash2.default.flatten(hostName !== '' && deviceId !== '' ? [
                                    new _inquirer2.default.Separator('Select IoT Hub Device Connection String'), 'Device Information:  ' +
                                    hostName + '  ' + deviceId,
                                    new _inquirer2.default.Separator('-------------------'),
                                    {
                                        name: "Create new...",
                                        value: "$$" },

                                    new _inquirer2.default.Separator('-------------------')] :
                                    [new _inquirer2.default.Separator('Input IoT Hub Device Connection String'),
                                    new _inquirer2.default.Separator('-------------------'),
                                    {
                                        name: "Create new...",
                                        value: "$$" },

                                    new _inquirer2.default.Separator('-------------------')]),


                                    pageSize: 10 }]));case 7:result = _context6.sent;


                            connectionString = '';if (!(
                            result.choose != '$$')) {_context6.next = 13;break;}
                            connectionString = inputConnectionString;_context6.next = 19;break;case 13:_context6.next = 15;return (

                                _inquirer2.default.prompt([{
                                    name: 'iotDeviceConnectionString',
                                    type: 'input',
                                    message: 'Input the connection string of IoT Device: ' }]));case 15:_result = _context6.sent;

                            connectionString = _result.iotDeviceConnectionString;if (!(

                            connectionString.indexOf('HostName') === -1 ||
                            connectionString.indexOf('DeviceId') === -1 ||
                            connectionString.indexOf('SharedAccessKey') === -1)) {_context6.next = 19;break;}throw (
                                new Error('The format of the IoT Hub Device connection string is invalid.'));case 19:_context6.next = 21;return (


                                setDeviceConnectionString(connectionString));case 21:return _context6.abrupt('return', _context6.sent);case 24:_context6.prev = 24;_context6.t0 = _context6['catch'](3);

                            console.error(_context6.t0);_context6.next = 29;return (
                                telemetry.trace('Config IoT Hub device connection string failed: ' + _context6.t0.message));case 29:throw (
                                new Error('Config IoT Hub device connection string failed: ' + _context6.t0.message));case 30:case 'end':return _context6.stop();}}}, _callee6, undefined, [[3, 24]]);}));return function run(_x3) {return _ref6.apply(this, arguments);};}() };




exports.config_wifi = {
    name: 'Config Wi-Fi',
    run: function () {var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee10() {var comPort, commandExecuted, opened, gotData, configMode, port, inputStage, buffer, inputWifiSSID, inputWifiPassword, exitConfigMode, _error, inputAll, openPromise, configPromise, timerId;return _regenerator2.default.wrap(function _callee10$(_context10) {while (1) {switch (_context10.prev = _context10.next) {case 0:_context10.next = 2;return (
                                chooseCOM());case 2:comPort = _context10.sent;
                            console.log('Opening ' + comPort + ', please wait.');

                            commandExecuted = false;
                            opened = false;
                            gotData = false;
                            configMode = false;
                            port = new _serialport2.default(comPort, {
                                baudRate: _constants2.default.DEFAULT_BAUD_RATE,
                                dataBits: 8,
                                stopBits: 1,
                                xon: false,
                                xoff: false,
                                parity: 'none' });

                            inputStage = false;
                            buffer = [];
                            inputWifiSSID = function () {var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7() {var result;return _regenerator2.default.wrap(function _callee7$(_context7) {while (1) {switch (_context7.prev = _context7.next) {case 0:
                                                    inputStage = true;_context7.next = 3;return (
                                                        _inquirer2.default.prompt([{
                                                            name: 'ssid',
                                                            type: 'input',
                                                            message: 'Wi-Fi SSID: ' }]));case 3:result = _context7.sent;

                                                    inputStage = false;if (!(
                                                    result && result.ssid)) {_context7.next = 10;break;}_context7.next = 8;return (
                                                        sendDataPromise(port, '\r\nset_wifissid "' + result.ssid + '"\r\n'));case 8:_context7.next = 11;break;case 10:

                                                    new Error('Please input Wi-Fi SSID.');case 11:case 'end':return _context7.stop();}}}, _callee7, undefined);}));return function inputWifiSSID() {return _ref8.apply(this, arguments);};}();


                            inputWifiPassword = function () {var _ref9 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8() {var result, password;return _regenerator2.default.wrap(function _callee8$(_context8) {while (1) {switch (_context8.prev = _context8.next) {case 0:
                                                    inputStage = true;_context8.next = 3;return (
                                                        _inquirer2.default.prompt([{
                                                            name: 'password',
                                                            type: 'password',
                                                            message: 'Wi-Fi Password: ' }]));case 3:result = _context8.sent;

                                                    inputStage = false;

                                                    password = result && result.password ? result.password : '';_context8.next = 8;return (
                                                        sendDataPromise(port, '\r\nset_wifipwd "' + password + '"\r\n'));case 8:case 'end':return _context8.stop();}}}, _callee8, undefined);}));return function inputWifiPassword() {return _ref9.apply(this, arguments);};}();


                            exitConfigMode = function exitConfigMode() {
                                return sendDataPromise(port, '\r\nexit\r\n');
                            };
                            _error = void 0;
                            inputAll = function () {var _ref10 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9() {return _regenerator2.default.wrap(function _callee9$(_context9) {while (1) {switch (_context9.prev = _context9.next) {case 0:_context9.prev = 0;_context9.next = 3;return (

                                                        inputWifiSSID());case 3:_context9.next = 5;return (
                                                        inputWifiPassword());case 5:_context9.next = 10;break;case 7:_context9.prev = 7;_context9.t0 = _context9['catch'](0);

                                                    _error = _context9.t0;case 10:


                                                    setTimeout(function () {
                                                        try {
                                                            port.close();
                                                        } catch (ignore) {}
                                                    }, 1000);if (!

                                                    _error) {_context9.next = 15;break;}_context9.next = 14;return (
                                                        telemetry.trace('Task config Wi-Fi failed: ' + _error));case 14:throw (
                                                        _error);case 15:

                                                    telemetry.trace('Task config Wi-Fi succeeded.');return _context9.abrupt('return',
                                                    'success');case 17:case 'end':return _context9.stop();}}}, _callee9, undefined, [[0, 7]]);}));return function inputAll() {return _ref10.apply(this, arguments);};}();


                            port.on('error', function (err) {
                                if (err && err.toString().includes('Access denied')) {
                                    console.log(comPort + ' is occupied, please close the application which opened that COM port and retry again.');
                                } else {
                                    console.log('Unknown error', err);
                                }
                            });

                            port.on('close', function (err) {
                                opened = false;
                            });

                            openPromise = new _promise2.default(function (resolve, reject) {
                                try {
                                    port.on('open', function (err) {
                                        if (err) {
                                            return reject(err);
                                        } else {
                                            opened = true;
                                            sendDataPromise(port, '\r\nhelp\r\n').then(resolve).catch(reject);
                                        }
                                    });
                                } catch (error) {
                                    console.log('unknown', error);
                                    reject(error);
                                }
                            });
                            configPromise = new _promise2.default(function (resolve, resject) {
                                port.on('data', function (data) {
                                    gotData = true;
                                    if (inputStage) {
                                        buffer.push(data);
                                        return;
                                    }
                                    if (buffer && buffer.length) {
                                        buffer.push(data);
                                        data = Buffer.concat(buffer);
                                        buffer = [];
                                    }
                                    var output = data.toString().trim();
                                    if (output.includes('set_wifissid')) {
                                        configMode = true;
                                        _lodash2.default.each(output.split('\n'), function (line) {
                                            if (line) {
                                                line = _lodash2.default.trimStart(line.trim(), '#').trim();
                                                if (line && line.length) {
                                                    if (/set_wifipwd.*\*/.test(line)) {
                                                        line = line === 'set_wifipwd **' ? 'set_wifipwd [empty]' : line.substr(0, line.length - 2);
                                                    }
                                                    console.log('SerialOutput', line);
                                                }
                                            }
                                        });
                                        resolve();
                                    }
                                });
                            });

                            timerId = setInterval(function () {
                                if (configMode) {
                                    clearInterval(timerId);
                                    return;
                                }
                                if (!opened) {
                                    port.open();
                                    return;
                                }

                                if (!gotData || !configMode) {
                                    console.log(_constants2.default.CONFIGURATION_MODE_PROMPT);
                                    sendDataPromise(port, '\r\nhelp\r\n').catch(console.log);
                                } else {
                                    clearInterval(timerId);
                                }
                            }, 5000);_context10.next = 23;return (

                                openPromise);case 23:_context10.next = 25;return (
                                configPromise);case 25:_context10.next = 27;return (
                                inputAll());case 27:return _context10.abrupt('return', _context10.sent);case 28:case 'end':return _context10.stop();}}}, _callee10, undefined);}));return function run() {return _ref7.apply(this, arguments);};}() };