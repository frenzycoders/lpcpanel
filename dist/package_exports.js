"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.machineId = exports.readline = exports.v = exports.chalk = exports.pm2 = exports.log = exports.spinner = void 0;
const pm2_1 = __importDefault(require("pm2"));
const readline_sync_1 = __importDefault(require("readline-sync"));
const cli_spinner_1 = require("cli-spinner");
const chalk_1 = __importDefault(require("chalk"));
const package_json_1 = require("./package.json");
exports.spinner = new cli_spinner_1.Spinner({
    stream: process.stderr,
    onTick: function (msg) {
        this.clearLine(this.stream);
        this.stream.write(msg);
    }
});
exports.spinner.setSpinnerString('|/-\\');
exports.log = console.log;
exports.pm2 = pm2_1.default;
exports.chalk = chalk_1.default;
exports.v = package_json_1.version;
exports.readline = readline_sync_1.default;
exports.machineId = 'machineId';
//# sourceMappingURL=package_exports.js.map