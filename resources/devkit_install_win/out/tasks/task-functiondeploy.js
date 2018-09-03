'use strict';var _regenerator = require('babel-runtime/regenerator');var _regenerator2 = _interopRequireDefault(_regenerator);var _stringify = require('babel-runtime/core-js/json/stringify');var _stringify2 = _interopRequireDefault(_stringify);var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);var _map = require('babel-runtime/core-js/map');var _map2 = _interopRequireDefault(_map);var _promise = require('babel-runtime/core-js/promise');var _promise2 = _interopRequireDefault(_promise);var _archiver = require('archiver');var _archiver2 = _interopRequireDefault(_archiver);
var _azurecli = require('../azurecli');var _azurecli2 = _interopRequireDefault(_azurecli);
var _fsPlus = require('fs-plus');var _fsPlus2 = _interopRequireDefault(_fsPlus);
var _path = require('path');var _path2 = _interopRequireDefault(_path);
var _requestPromise = require('request-promise');var _requestPromise2 = _interopRequireDefault(_requestPromise);
var _telemetry = require('../telemetry');var telemetry = _interopRequireWildcard(_telemetry);function _interopRequireWildcard(obj) {if (obj && obj.__esModule) {return obj;} else {var newObj = {};if (obj != null) {for (var key in obj) {if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];}}newObj.default = obj;return newObj;}}function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

// https://github.com/Finametrix/node-archiver-pack
var zip = function zip(targetPath, folderName, files) {
    return new _promise2.default(function (resolve, reject) {
        var outStream = void 0;
        var archive = void 0;
        var inputStreams = void 0;

        try {
            inputStreams = files.map(function (filePath) {
                var stream = _fsPlus2.default.createReadStream(filePath);
                stream.on('error', reject);
                return stream;
            });
            outStream = _fsPlus2.default.createWriteStream(targetPath);
            archive = new _archiver2.default('zip');
        } catch (err) {
            return reject(err);
        }

        outStream.on('close', resolve);
        archive.on('error', reject);
        archive.pipe(outStream);
        for (var i = 0; i < files.length; i++) {
            var filePath = files[i];
            archive.append(inputStreams[i], {
                name: folderName + '/' + _path2.default.basename(filePath),
                _stats: new _map2.default().get(filePath) });

        }
        archive.finalize();
    });
};

exports.default = {
    name: "Deploy function app",
    run: function () {var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(context) {var settings, runtimeJsonFilePath, azureCliLocation, azurecli, result, accessToken, publishUrl, apiListUrl, apiListResponse, i, item, functionListApiUrl, data, files, functionAbsolutePath, zipTargetPath, apiZipUrl, apiZipResponse;return _regenerator2.default.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:_context.prev = 0;

                            settings = context.arduino_project.settings;
                            runtimeJsonFilePath = _path2.default.join(context.arduino_project.rootFolder, '.build', 'runtime.json');
                            settings.config_data = JSON.parse(_fsPlus2.default.readFileSync(runtimeJsonFilePath, 'utf-8'));

                            azureCliLocation = settings.config_data.azureCliLocation;if (
                            azureCliLocation) {_context.next = 7;break;}throw (
                                new Error('Please install Azure CLI 2.0 first.'));case 7:


                            azurecli = new _azurecli2.default(azureCliLocation);_context.next = 10;return (
                                azurecli.execResultJson('account get-access-token'));case 10:result = _context.sent;
                            accessToken = result.accessToken;if (

                            accessToken) {_context.next = 16;break;}_context.next = 15;return (
                                telemetry.trace('Task deploy function app: get access token failed.'));case 15:throw (
                                new Error('Cannot get access token.'));case 16:


                            publishUrl = settings.config_data.functionAppName + '.scm.azurewebsites.net';

                            // Disable all existed functions
                            apiListUrl = 'https://' + publishUrl + '/api/vfs/site/wwwroot/';_context.next = 20;return (
                                (0, _requestPromise2.default)(apiListUrl, {
                                    method: 'GET',
                                    headers: {
                                        "Authorization": 'Bearer ' + accessToken } }));case 20:apiListResponse = _context.sent;



                            apiListResponse = JSON.parse(apiListResponse);
                            i = 0;case 23:if (!(i < apiListResponse.length)) {_context.next = 44;break;}
                            item = apiListResponse[i];if (!(
                            item.mime === 'inode/directory')) {_context.next = 41;break;}
                            functionListApiUrl = 'https://' + publishUrl + '/api/vfs/site/wwwroot/' + item.name + '/function.json';_context.prev = 27;_context.next = 30;return (

                                (0, _requestPromise2.default)(functionListApiUrl, {
                                    method: 'GET',
                                    headers: {
                                        "Authorization": 'Bearer ' + accessToken } }));case 30:data = _context.sent;



                            // Remove BOMs
                            data = data.match(/{[\s\S]*}/)[0];
                            data = JSON.parse(data);
                            data.disabled = true;
                            data = (0, _stringify2.default)(data);_context.next = 37;return (

                                (0, _requestPromise2.default)(functionListApiUrl, {
                                    method: 'PUT',
                                    headers: {
                                        "Authorization": 'Bearer ' + accessToken,
                                        "If-Match": "*" },

                                    body: data }));case 37:_context.next = 41;break;case 39:_context.prev = 39;_context.t0 = _context['catch'](27);case 41:i++;_context.next = 23;break;case 44:



                            ;

                            // auto zip
                            files = [];
                            functionAbsolutePath = _path2.default.join(context.arduino_project.rootFolder, settings.functionRelativePath, settings.functionName);
                            _fsPlus2.default.readdirSync(functionAbsolutePath).forEach(function (file) {
                                file = _path2.default.join(functionAbsolutePath, file);
                                if (!_fsPlus2.default.isDirectorySync(file)) {
                                    files.push(file);
                                }
                            });

                            zipTargetPath = _path2.default.join(context.arduino_project.rootFolder, settings.functionRelativePath, settings.functionName + '.zip');
                            if (_fsPlus2.default.existsSync(zipTargetPath)) {
                                _fsPlus2.default.unlinkSync(zipTargetPath);
                            }_context.next = 52;return (
                                zip(zipTargetPath, settings.functionName, files));case 52:

                            apiZipUrl = 'https://' + publishUrl + '/api/zip/site/wwwroot';_context.next = 55;return (
                                (0, _requestPromise2.default)(apiZipUrl, {
                                    method: 'PUT',
                                    headers: {
                                        "Authorization": 'Bearer ' + accessToken,
                                        "If-Match": "*" },

                                    body: _fsPlus2.default.readFileSync(zipTargetPath) }));case 55:apiZipResponse = _context.sent;_context.next = 58;return (


                                telemetry.trace('Task deploy function app succeeded', context.iotHubName));case 58:_context.next = 65;break;case 60:_context.prev = 60;_context.t1 = _context['catch'](0);_context.next = 64;return (

                                telemetry.trace('Task deploy function app failed: ' + _context.t1.message, context.iotHubName));case 64:throw (
                                new Error(_context.t1.message));case 65:return _context.abrupt('return',


                            'Done');case 66:case 'end':return _context.stop();}}}, _callee, undefined, [[0, 60], [27, 39]]);}));return function run(_x) {return _ref.apply(this, arguments);};}() };