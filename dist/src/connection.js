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
exports.dbConnection = void 0;
const path_1 = require("path");
const typeorm_1 = require("typeorm");
const chalk_1 = __importDefault(require("chalk"));
const cli_spinner_1 = require("cli-spinner");
const mode_1 = require("./mode");
const spinner = new cli_spinner_1.Spinner({
    stream: process.stderr,
    onTick: function (msg) {
        this.clearLine(this.stream);
        this.stream.write(msg);
    }
});
spinner.setSpinnerString('|/-\\');
const dbConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(chalk_1.default.green('> [process]: ') + chalk_1.default.blue('connecting to database..'));
        spinner.start();
        yield (0, typeorm_1.createConnection)({
            type: "sqlite",
            database: (0, path_1.join)(__dirname, 'database.db'),
            entities: [mode_1.MachineID],
            synchronize: true,
        });
        spinner.stop(true);
        console.log(chalk_1.default.green('> [OK]: ') + chalk_1.default.greenBright('database connection status: ') + chalk_1.default.yellow('true'));
    }
    catch (error) {
        console.log(chalk_1.default.redBright('> [error]: ') + chalk_1.default.red('database connection error'));
        console.log(error.message);
        process.exit(0);
    }
});
exports.dbConnection = dbConnection;
//# sourceMappingURL=connection.js.map