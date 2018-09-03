"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = undefined;var _promise = require("babel-runtime/core-js/promise");var _promise2 = _interopRequireDefault(_promise);var _extends2 = require("babel-runtime/helpers/extends");var _extends3 = _interopRequireDefault(_extends2);var _regenerator = require("babel-runtime/regenerator");var _regenerator2 = _interopRequireDefault(_regenerator);var _getIterator2 = require("babel-runtime/core-js/get-iterator");var _getIterator3 = _interopRequireDefault(_getIterator2);var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);var _assign = require("babel-runtime/core-js/object/assign");var _assign2 = _interopRequireDefault(_assign);var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);var _createClass2 = require("babel-runtime/helpers/createClass");var _createClass3 = _interopRequireDefault(_createClass2);var _os = require("os");var _os2 = _interopRequireDefault(_os);
var _path = require("path");var _path2 = _interopRequireDefault(_path);
var _glob = require("glob");var _glob2 = _interopRequireDefault(_glob);
var _fsPlus = require("fs-plus");var _fsPlus2 = _interopRequireDefault(_fsPlus);
var _fsExtra = require("fs-extra");var _fsExtra2 = _interopRequireDefault(_fsExtra);
var _mkdirp = require("mkdirp");var _mkdirp2 = _interopRequireDefault(_mkdirp);
var _winreg = require("winreg");var _winreg2 = _interopRequireDefault(_winreg);
var _util = require("./util");var util = _interopRequireWildcard(_util);
var _bufferredProcess = require("./bufferred-process");var _bufferredProcess2 = _interopRequireDefault(_bufferredProcess);function _interopRequireWildcard(obj) {if (obj && obj.__esModule) {return obj;} else {var newObj = {};if (obj != null) {for (var key in obj) {if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];}}newObj.default = obj;return newObj;}}function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

var readConfigFileToJson = function readConfigFileToJson(file) {
    if (!_fsPlus2.default.isFileSync(file)) return {};
    var regex = /([\w\.]+)=(.+)/;
    var rawText = _fsPlus2.default.readFileSync(file, "utf8");
    var result = {};
    var lines = rawText.split(/[\r|\r\n|\n]/);
    lines.forEach(function (line) {
        // Ignore comments and menu description lines.
        if (!line || line.startsWith("#") || line.startsWith("menu.")) {
            return;
        }
        var match = regex.exec(line);
        if (match && match[1] && match.length > 2) {
            result[match[1]] = match[2];
        }
    });
    return result;
};var


Arduino = function () {
    function Arduino(opt) {(0, _classCallCheck3.default)(this, Arduino);
        this.opt = (0, _assign2.default)({}, opt);
        var platform = _os2.default.platform();
        if (platform === 'win32') {
            this._packagePath = _path2.default.join(process.env.LOCALAPPDATA, 'Arduino15');
            this._libPath = _path2.default.join(process.env.USERPROFILE, 'Documents', 'Arduino', 'libraries');
        } else if (platform === 'linux') {
            this._packagePath = _path2.default.join(process.env.HOME, '.arduino15');
            this._libPath = _path2.default.join(process.env.HOME, 'Arduino', 'libraries');
        } else if (platform === 'darwin') {
            this._packagePath = _path2.default.join(process.env.HOME, 'Library', 'Arduino15');
            this._libPath = _path2.default.join(process.env.HOME, 'Documents', 'Arduino', 'libraries');
        }
    }(0, _createClass3.default)(Arduino, [{ key: "_checkPackageExist", value: function _checkPackageExist()

        {
            return _fsPlus2.default.isDirectorySync(this._packagePath);
        } }, { key: "_checkLibExist", value: function _checkLibExist()

        {
            return _fsPlus2.default.isDirectorySync(this._libPath);
        } }, { key: "_internalResolveArduinoPath", value: function () {var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {var plat, location, arduinoRegistryPath, defaultCommonPaths, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, scanPath, _defaultCommonPaths, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, _scanPath, _defaultCommonPaths2, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, _scanPath2;return _regenerator2.default.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:


                                plat = _os2.default.platform();_context.prev = 1;_context.next = 4;return (

                                    util.findExecutive(plat === "win32" ? "arduino_debug" : "arduino"));case 4:location = _context.sent;if (!
                                _fsPlus2.default.isFileSync(location)) {_context.next = 7;break;}return _context.abrupt("return",
                                _path2.default.dirname(location));case 7:_context.next = 11;break;case 9:_context.prev = 9;_context.t0 = _context["catch"](1);case 11:if (!(





                                plat === 'win32')) {_context.next = 53;break;}if (!
                                util.isWin32X64()) {_context.next = 18;break;}_context.next = 15;return (
                                    this._listRegKey(_winreg2.default.HKLM, '\\SOFTWARE\\WOW6432Node\\Arduino', 'Install_Dir'));case 15:_context.t1 = _context.sent;_context.next = 21;break;case 18:_context.next = 20;return (
                                    this._listRegKey(_winreg2.default.HKLM, '\\SOFTWARE\\Arduino', 'Install_Dir'));case 20:_context.t1 = _context.sent;case 21:arduinoRegistryPath = _context.t1;if (!(
                                arduinoRegistryPath && _fsPlus2.default.isDirectorySync(arduinoRegistryPath))) {_context.next = 24;break;}return _context.abrupt("return",
                                arduinoRegistryPath);case 24:

                                defaultCommonPaths = [process.env.ProgramFiles, process.env['ProgramFiles(x86)']];_iteratorNormalCompletion = true;_didIteratorError = false;_iteratorError = undefined;_context.prev = 28;_iterator = (0, _getIterator3.default)(
                                defaultCommonPaths);case 30:if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {_context.next = 37;break;}scanPath = _step.value;if (!(
                                scanPath && _fsPlus2.default.isDirectorySync(_path2.default.join(scanPath, 'Arduino')))) {_context.next = 34;break;}return _context.abrupt("return",
                                _path2.default.join(scanPath, "Arduino"));case 34:_iteratorNormalCompletion = true;_context.next = 30;break;case 37:_context.next = 43;break;case 39:_context.prev = 39;_context.t2 = _context["catch"](28);_didIteratorError = true;_iteratorError = _context.t2;case 43:_context.prev = 43;_context.prev = 44;if (!_iteratorNormalCompletion && _iterator.return) {_iterator.return();}case 46:_context.prev = 46;if (!_didIteratorError) {_context.next = 49;break;}throw _iteratorError;case 49:return _context.finish(46);case 50:return _context.finish(43);case 51:_context.next = 111;break;case 53:if (!(


                                plat === 'darwin')) {_context.next = 83;break;}
                                _defaultCommonPaths = [_path2.default.join(process.env.HOME, 'Applications'), '/Applications'];_iteratorNormalCompletion2 = true;_didIteratorError2 = false;_iteratorError2 = undefined;_context.prev = 58;_iterator2 = (0, _getIterator3.default)(
                                _defaultCommonPaths);case 60:if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {_context.next = 67;break;}_scanPath = _step2.value;if (!
                                _fsPlus2.default.isDirectorySync(_path2.default.join(_scanPath, 'Arduino.app'))) {_context.next = 64;break;}return _context.abrupt("return",
                                _scanPath);case 64:_iteratorNormalCompletion2 = true;_context.next = 60;break;case 67:_context.next = 73;break;case 69:_context.prev = 69;_context.t3 = _context["catch"](58);_didIteratorError2 = true;_iteratorError2 = _context.t3;case 73:_context.prev = 73;_context.prev = 74;if (!_iteratorNormalCompletion2 && _iterator2.return) {_iterator2.return();}case 76:_context.prev = 76;if (!_didIteratorError2) {_context.next = 79;break;}throw _iteratorError2;case 79:return _context.finish(76);case 80:return _context.finish(73);case 81:_context.next = 111;break;case 83:if (!(


                                plat === 'linux')) {_context.next = 111;break;}
                                _defaultCommonPaths2 = ['/opt'];_iteratorNormalCompletion3 = true;_didIteratorError3 = false;_iteratorError3 = undefined;_context.prev = 88;_iterator3 = (0, _getIterator3.default)(
                                _defaultCommonPaths2);case 90:if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {_context.next = 97;break;}_scanPath2 = _step3.value;if (!
                                _fsPlus2.default.isDirectorySync(_path2.default.join(_scanPath2, 'arduino-1.8.3'))) {_context.next = 94;break;}return _context.abrupt("return",
                                _path2.default.join(_scanPath2, 'arduino-1.8.3'));case 94:_iteratorNormalCompletion3 = true;_context.next = 90;break;case 97:_context.next = 103;break;case 99:_context.prev = 99;_context.t4 = _context["catch"](88);_didIteratorError3 = true;_iteratorError3 = _context.t4;case 103:_context.prev = 103;_context.prev = 104;if (!_iteratorNormalCompletion3 && _iterator3.return) {_iterator3.return();}case 106:_context.prev = 106;if (!_didIteratorError3) {_context.next = 109;break;}throw _iteratorError3;case 109:return _context.finish(106);case 110:return _context.finish(103);case 111:case "end":return _context.stop();}}}, _callee, this, [[1, 9], [28, 39, 43, 51], [44,, 46, 50], [58, 69, 73, 81], [74,, 76, 80], [88, 99, 103, 111], [104,, 106, 110]]);}));function _internalResolveArduinoPath() {return _ref.apply(this, arguments);}return _internalResolveArduinoPath;}() }, { key: "_resolveArduinoExecutive", value: function _resolveArduinoExecutive(




        arduinoPath) {
            var platform = _os2.default.platform();
            var arduinoExe = '';
            if (platform === 'darwin') {
                arduinoExe = _path2.default.join(arduinoPath, 'Arduino.app', 'Contents', 'MacOS', 'Arduino');
            } else if (platform === 'linux') {
                arduinoExe = _path2.default.join(arduinoPath, 'arduino');
            } else if (platform === 'win32') {
                arduinoExe = _path2.default.join(arduinoPath, 'arduino_debug.exe');
            }
            if (!_fsPlus2.default.isFileSync(arduinoExe)) {
                throw new Error("Cannot find arduino executive at " + arduinoExe);
            }
            return arduinoExe;
        } }, { key: "resolveArduinoPath", value: function () {var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {return _regenerator2.default.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:_context2.t0 =


                                this.opt["arduinoPath"];if (_context2.t0) {_context2.next = 5;break;}_context2.next = 4;return this._internalResolveArduinoPath();case 4:_context2.t0 = _context2.sent;case 5:this.arduinoPath = _context2.t0;if (
                                _fsPlus2.default.isDirectorySync(this.arduinoPath)) {_context2.next = 8;break;}throw (
                                    new Error("Cannot find arduino path at " + this.arduinoPath));case 8:

                                this.command = this._resolveArduinoExecutive(this.arduinoPath);case 9:case "end":return _context2.stop();}}}, _callee2, this);}));function resolveArduinoPath() {return _ref2.apply(this, arguments);}return resolveArduinoPath;}() }, { key: "_parseBoardDescriptorFile", value: function _parseBoardDescriptorFile(


        boardDescriptor, platform, architecture, platformDisplayName) {
            var boardLineRegex = /([^\.]+)\.(\S+)=(.+)/;

            var result = {};
            var lines = boardDescriptor.split(/[\r|\r\n|\n]/);
            lines.forEach(function (line) {
                // Ignore comments and menu description lines.
                if (line.startsWith("#") || line.startsWith("menu.")) {
                    return;
                }
                var match = boardLineRegex.exec(line);
                if (match && match.length > 3) {
                    var boardObject = result[match[1]];
                    if (!boardObject) {
                        boardObject = {
                            board: match[1],
                            platform: platform,
                            platformName: platformDisplayName,
                            architecture: architecture };

                        result[boardObject.board] = boardObject;
                    }
                    if (match[2] === "name") {
                        boardObject.name = match[3].trim();
                    }
                }
            });
            return result;
        } }, { key: "loadInstalledBoards", value: function loadInstalledBoards()


        {var _this = this;
            this._boards = {};
            var files = _glob2.default.sync([this._packagePath.replace(/\\/g, '/'), "packages", "*", "hardware", "*", "*", "boards.txt"].join('/'));
            files.forEach(function (file) {
                var boardContent = _fsPlus2.default.readFileSync(file, "utf8");
                var _paths = _path2.default.dirname(file).split('/');
                var packagesIndex = _paths.indexOf('packages');
                if (packagesIndex < 0) {
                    return;
                }
                var platformObj = readConfigFileToJson(_path2.default.join(_path2.default.dirname(file), 'platform.txt'));

                var platformName = _paths[packagesIndex + 1];
                var architecture = _paths[packagesIndex + 3];

                _this._boards = (0, _extends3.default)({}, _this._boards, _this._parseBoardDescriptorFile(boardContent, platformName, architecture, platformObj.name));
            });
            // for (let k of Object.keys(this._boards)) {
            //     console.log(k, ' ==> ', this._boards[k].name, this._boards[k].platformName);
            // }
        } }, { key: "compile", value: function () {var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(

            boardPlatformArch, sketch, outputDir, outputFunc) {var args, files, exitcode;return _regenerator2.default.wrap(function _callee3$(_context3) {while (1) {switch (_context3.prev = _context3.next) {case 0:if (
                                this._boards) {_context3.next = 2;break;}throw (
                                    new Error('Please initialize first before compile.'));case 2:

                                if (!_fsPlus2.default.isDirectorySync(outputDir)) {
                                    _mkdirp2.default.sync(outputDir);
                                }
                                args = ["--verify", "--board", boardPlatformArch, "--preferences-file",
                                outputDir + "/pref.txt", "--pref", "compiler.warning_level=none", "--pref",
                                "build.path=" + ("" +
                                outputDir), sketch];
                                files = _glob2.default.sync([outputDir.replace(/\\/g, '/'), "*.bin"].join('/'));
                                if (files && files.length) {
                                    files.forEach(function (file) {
                                        console.log('Deleting', file);
                                        _fsPlus2.default.unlinkSync(file);
                                    });
                                }_context3.next = 8;return (

                                    util.executeWithProgress(this.command, args, outputFunc));case 8:exitcode = _context3.sent;if (!(
                                exitcode !== 0)) {_context3.next = 11;break;}throw (
                                    new Error("Upload failure with error code " + exitcode));case 11:return _context3.abrupt("return",

                                'ok');case 12:case "end":return _context3.stop();}}}, _callee3, this);}));function compile(_x, _x2, _x3, _x4) {return _ref3.apply(this, arguments);}return compile;}() }, { key: "upload", value: function () {var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(


            boardPlatformArch, sketch, outputDir, outputFunc) {var args, files, exitcode;return _regenerator2.default.wrap(function _callee4$(_context4) {while (1) {switch (_context4.prev = _context4.next) {case 0:if (
                                this._boards) {_context4.next = 2;break;}throw (
                                    new Error('Please initialize first before compile.'));case 2:

                                if (!_fsPlus2.default.isDirectorySync(outputDir)) {
                                    _mkdirp2.default.sync(outputDir);
                                }
                                args = ["--upload", "--board", boardPlatformArch, "--preferences-file",
                                outputDir + "/pref.txt", "--pref", "compiler.warning_level=none", "--pref",
                                "build.path=" + ("" +
                                outputDir), sketch];
                                files = _glob2.default.sync([outputDir.replace(/\\/g, '/'), "*.bin"].join('/'));
                                if (files && files.length) {
                                    files.forEach(function (file) {
                                        console.log('Deleting', file);
                                        _fsPlus2.default.unlinkSync(file);
                                    });
                                }_context4.next = 8;return (

                                    util.executeWithProgress(this.command, args, outputFunc));case 8:exitcode = _context4.sent;if (!(
                                exitcode !== 0)) {_context4.next = 11;break;}throw (
                                    new Error("Upload failure with error code " + exitcode));case 11:return _context4.abrupt("return",

                                'ok');case 12:case "end":return _context4.stop();}}}, _callee4, this);}));function upload(_x5, _x6, _x7, _x8) {return _ref4.apply(this, arguments);}return upload;}() }, { key: "getArduinoToolPath", value: function getArduinoToolPath(


        tool, executive) {
            if (_fsPlus2.default.isDirectorySync(_path2.default.join(this._packagePath, 'packages', 'arduino', 'tools', tool))) {
                var platform = _os2.default.platform();
                var parent = _path2.default.join(this._packagePath, 'packages', 'arduino', 'tools', tool).replace(/\\/g, '/');
                var files = _glob2.default.sync(parent + '/**/bin/' + (
                platform === 'win32' ? _path2.default.basename(executive, '.exe') + '.exe' : executive));
                if (files.length) return files[0];else
                return undefined;
            }
            return undefined;
        } }, { key: "_listRegKey", value: function _listRegKey(

        key, subkey, itemName) {
            var regKey = new _winreg2.default({ hive: key, key: subkey });
            return new _promise2.default(function (resolve, reject) {
                regKey.values(function (err, items) {
                    if (err) {
                        resolve(undefined);
                    } else {
                        for (var i = 0; i < items.length; i++) {
                            if (items[i].name === itemName) {
                                resolve(items[i].value);
                            }
                        }
                    }
                });
            });
        } }, { key: "listBoardPackageUrl", value: function listBoardPackageUrl()

        {
            if (!this._checkPackageExist()) {
                return [];
            }
            var preferencesPath = _path2.default.join(this._packagePath, 'preferences.txt');
            if (_fsPlus2.default.isFileSync(preferencesPath)) {
                var preferences = this._parsePreferencesFile(preferencesPath);
                if (preferences['boardsmanager.additional.urls']) {
                    return this._formatUrls(preferences['boardsmanager.additional.urls']);
                } else {
                    return [];
                }
            } else {
                return [];
            }
        } }, { key: "_parsePreferencesFile", value: function _parsePreferencesFile(

        fileName) {var filterComment = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
            var result = {};
            var lineRegex = /(\S+)=(\S+)/;

            if (_fsPlus2.default.isFileSync(fileName)) {
                var rawText = _fsExtra2.default.readFileSync(fileName, "utf8");
                var lines = rawText.split("\n");
                lines.forEach(function (line) {
                    if (line) {
                        if (filterComment) {
                            if (line.trim() && line.startsWith("#")) {
                                return;
                            }
                        }
                        var match = lineRegex.exec(line);
                        if (match && match.length > 2) {
                            result[match[1]] = match[2];
                        }
                    }
                });
            }
            return result;
        } }, { key: "_formatUrls", value: function _formatUrls(

        urls) {
            if (urls) {
                if (!Array.isArray(urls) && typeof urls === "string") {
                    return urls.split(",");
                }
                return urls;
            }
            return [];
        } }]);return Arduino;}();exports.default = Arduino;