'use strict';var _stringify = require('babel-runtime/core-js/json/stringify');var _stringify2 = _interopRequireDefault(_stringify);var _promise = require('babel-runtime/core-js/promise');var _promise2 = _interopRequireDefault(_promise);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var request = require('request-promise');
var getmac = require('getmac');
var crypto = require('crypto');
var os = require('os');
var arch = require('arch');
var path = require('path');
var fs = require('fs-plus');

var BODY = '{"data": {"baseType": "EventData"}, "name":"AIEVENT"}';
var HOST = 'https://dc.services.visualstudio.com/v2/track';
var IKEY = '63d78aab-86a7-49b9-855f-3bdcff5d39d7';
var KEYWORD = 'AZ3166';
var HARDWARE = '1.3.2';
var MCU = 'STM32F412';
var BASEDATA_NAME = 'script';
var OS_ARCH = arch();
var OS_TYPE = os.type();
var OS_PLAT = os.platform();

var _arduinoPackagePath = void 0;
if (OS_PLAT === 'win32') {
    _arduinoPackagePath = path.join(process.env['USERPROFILE'], 'AppData', 'Local', 'Arduino15', 'packages');
} else if (OS_PLAT === 'darwin') {
    _arduinoPackagePath = path.join(process.env.HOME, 'Library', 'Arduino15', 'packages');
}
var constants = {
    arduinoPackagePath: path.join(_arduinoPackagePath, 'AZ3166', 'hardware', 'stm32f4'),
    platformLocalFileName: 'platform.local.txt',
    disableTraceFlag: 'ENABLETRACE=0' };


exports.trace = function (message) {var iothub = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';var hideIp = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    if (fs.existsSync(constants.arduinoPackagePath))
    {
        var files = fs.readdirSync(constants.arduinoPackagePath);
        for (var i = files.length - 1; i >= 0; i--)
        {
            if (files[i] === '.DS_Store')
            {
                files.splice(i, 1);
            }
        }

        if (files.length === 1)
        {
            var directoryName = path.join(constants.arduinoPackagePath, files[0]);
            if (fs.isDirectorySync(directoryName))
            {
                var fileName = path.join(directoryName, constants.platformLocalFileName);
                if (fs.existsSync(fileName))
                {
                    var contents = fs.readFileSync(fileName, 'utf8');
                    if (contents.indexOf(constants.disableTraceFlag) !== -1)
                    {
                        // Disable tracing, return.
                        return;
                    }
                }
            }
        }
    }

    var obj = JSON.parse(BODY);
    obj.data.baseData = {};
    obj.data.baseData.name = BASEDATA_NAME;
    obj.data.baseData.properties = {};
    obj.data.baseData.properties.keyword = KEYWORD;
    obj.data.baseData.properties.mcu = MCU;
    obj.data.baseData.properties.message = message;
    obj.data.baseData.properties.hardware_version = HARDWARE;
    obj.data.baseData.properties.osarch = OS_ARCH;
    obj.data.baseData.properties.ostype = OS_TYPE;
    obj.data.baseData.properties.osplat = OS_PLAT;
    obj.iKey = IKEY;
    obj.time = new Date().toUTCString();

    if (iothub && iothub.trim() !== '') {
        obj.data.baseData.properties.hash_iothub_name = crypto.createHash('md5').update(iothub.trim(), 'utf8').digest('hex');
    }

    obj.data.baseData.properties.project_name = path.basename(process.cwd());

    if (hideIp) {
        obj.tags = obj.tags || {};
        obj.tags['ai.location.ip'] = 0;
    }

    return new _promise2.default(function (resolve, reject) {
        getmac.getMac(function (err, macAddress) {
            obj.data.baseData.properties.hash_mac_address = crypto.createHash('sha256').update(macAddress, 'utf8').digest('hex');

            var options = {
                method: 'POST',
                uri: HOST,
                body: (0, _stringify2.default)(obj) };


            if (process.env.BIDEBUG === 'true') {
                console.log('telemetry trace: ' + message);
                request(options).then(function (data) {
                    console.log('telemetry trace: got response for ' + message);
                    console.log(data);
                    resolve(data);
                }).catch(reject);
            } else {
                request(options).then(resolve).catch(reject);
            }
        });
    });
};