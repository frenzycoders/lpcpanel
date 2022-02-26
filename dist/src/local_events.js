"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.events = void 0;
const fs_1 = require("fs");
const os_1 = require("os");
const archiver_1 = __importDefault(require("archiver"));
const uuid_1 = require("uuid");
const screenshot_desktop_1 = __importDefault(require("screenshot-desktop"));
(0, screenshot_desktop_1.default)({ format: 'gif' });
const events = (socket) => __awaiter(void 0, void 0, void 0, function* () {
    socket.on('READ_DIR', (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let directory = [];
            let dir = yield fs_1.promises.readdir(data.path, { withFileTypes: true });
            dir.map((e) => {
                if (data.hidden == "true") {
                    directory.push({ "name": e.name, "isFile": e.isDirectory() });
                }
                else {
                    if (e.name[0] != '.')
                        directory.push({ "name": e.name, "isFile": e.isDirectory() });
                }
            });
            console.log('point c');
            socket.emit(data.mid, { status: true, directory });
        }
        catch (error) {
            console.log('point error local');
            socket.emit(data.mid, { status: false, dir: [], message: error.message });
        }
    }));
    socket.on('myid', (id) => {
        console.log(id);
    });
    socket.on('disconnect', () => {
        console.log('Disconnected');
    });
    socket.on('SYSTEM_DETAILS', (data) => __awaiter(void 0, void 0, void 0, function* () {
        let disk;
        let sysDetails;
        if ((0, os_1.platform)() == 'win32') {
            sysDetails = {
                operatingSys: (0, os_1.platform)(),
                hostName: (0, os_1.hostname)(),
                platform: (0, os_1.platform)(),
                ostype: (0, os_1.type)(),
                release: (0, os_1.release)(),
                arch: (0, os_1.arch)(),
                homeDir: (0, os_1.homedir)(),
                version: (0, os_1.version)(),
                totalSpace: `512 GB`,
                free: `250 GB`,
                available: '262 GB'
            };
        }
        else {
            sysDetails = {
                operatingSys: (0, os_1.platform)(),
                hostName: (0, os_1.hostname)(),
                platform: (0, os_1.platform)(),
                ostype: (0, os_1.type)(),
                release: (0, os_1.release)(),
                arch: (0, os_1.arch)(),
                homeDir: (0, os_1.homedir)(),
                version: (0, os_1.version)(),
                totalSpace: `512 GB`,
                free: `250 GB`,
                available: '262 GB'
            };
            console.log(sysDetails);
        }
        socket.emit(data, sysDetails);
    }));
    socket.on('DOWNLOAD_FILE_REQUEST', (data) => __awaiter(void 0, void 0, void 0, function* () {
        if ((0, fs_1.existsSync)(data.path)) {
            var filearray = data.path.toString().split('/');
            var fileName = filearray[filearray.length - 1];
            socket.emit(data.wid, { filename: fileName + '.zip', data: data });
            try {
                socket.on('START' + data.mid, () => __awaiter(void 0, void 0, void 0, function* () {
                    let fileState = yield fs_1.promises.stat(data.path);
                    const archive = (0, archiver_1.default)('zip', {
                        zlib: { level: 9 }
                    });
                    if (fileState.isFile()) {
                        archive.file(data.path.toString(), { name: fileName });
                        archive.on('data', (chunk) => {
                            socket.emit(data.mid, { status: true, data: chunk });
                        });
                        archive.on('finish', () => {
                            socket.emit(data.mid, { status: true, end: true, filename: fileName + '.zip' });
                        });
                        archive.on('error', (err) => {
                            socket.emit(data.mid, { status: true, end: true, filename: fileName + '.zip' });
                        });
                        archive.finalize();
                    }
                    else {
                        archive.directory(data.path.toString(), false);
                        archive.on('data', (chunk) => {
                            socket.emit(data.mid, { status: true, data: chunk });
                        });
                        archive.on('finish', () => {
                            socket.emit(data.mid, { status: true, end: true, filename: fileName + '.zip' });
                        });
                        archive.on('error', (err) => {
                            socket.emit(data.mid, { status: true, end: true, error: true, filename: fileName + '.zip', errorData: err });
                        });
                        archive.finalize();
                    }
                }));
            }
            catch (error) {
                return socket.emit(data.mid, { status: false, message: 'This path is not a file' });
            }
        }
        else {
            return socket.emit(data.mid, { status: false, message: 'This path is not a file' });
        }
    }));
    socket.on('DELETE_FILE_REQUEST', ({ cb, path }) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if ((0, fs_1.existsSync)(path)) {
                if ((yield fs_1.promises.stat(path)).isDirectory()) {
                    yield fs_1.promises.rmdir(path, { recursive: true });
                    socket.emit(cb, { status: true, path: path, message: "Folder with path [ " + path + " ]" + " is deleted successfully. " });
                }
                else {
                    yield fs_1.promises.unlink(path);
                    socket.emit(cb, { status: true, path: path, message: "File with path [ " + path + " ] is deleted successfully.." });
                }
            }
            else {
                socket.emit(cb, { status: false, path: path, message: "This path is not exist" });
            }
        }
        catch (error) {
            socket.emit(cb, { status: false, path: path, error: error.message });
        }
    }));
    socket.on('RECIEVE_FILES', (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if ((0, fs_1.existsSync)(data.path)) {
                if ((yield fs_1.promises.stat(data.path)).isDirectory()) {
                    let stream = (0, fs_1.createWriteStream)(data.path + '/' + data.filename, { encoding: 'base64' });
                    let id = (0, uuid_1.v4)();
                    console.log('Stream created');
                    socket.on(id.toString(), ({ data, cb, status, error }) => {
                        if (status == true) {
                            socket.removeAllListeners(id);
                            stream.close();
                            socket.emit(cb, { status: true, message: 'path  is uploaded to local machine' });
                        }
                        else if (status == false) {
                            socket.emit(cb, { status: false, message: error.toString() });
                        }
                        else {
                            stream.write(data);
                        }
                    });
                    socket.emit(data.cb, { id: id.toString() });
                }
                else {
                    socket.emit(data.resId, { status: false, path: data.path, message: 'path [' + data.path + '] is a file type not a directory for upload' });
                }
            }
            else {
                socket.emit(data.resId, { status: false, path: data.path, message: 'This path not exist on local pc' });
            }
        }
        catch (error) {
            socket.emit(data.resId, { status: false, path: data.path, message: error.message });
        }
    }));
    socket.on('REQUEST_FROM_SCREEN_SHOT', ({ id }) => __awaiter(void 0, void 0, void 0, function* () {
        screenshot_desktop_1.default.all().then((data) => {
            console.log(data.length);
            socket.emit(id, data);
        });
    }));
});
exports.events = events;
//# sourceMappingURL=local_events.js.map