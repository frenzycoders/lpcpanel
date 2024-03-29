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
const http_1 = require("http");
const express_1 = __importDefault(require("express"));
const socket_1 = require("./socket");
const cors_1 = __importDefault(require("cors"));
const local_events_1 = require("./local_events");
const dotenv_1 = require("dotenv");
const api_1 = require("./api");
const package_exports_1 = require("./../package_exports");
const connection_1 = require("./connection");
const mode_1 = require("./mode");
(0, package_exports_1.log)(package_exports_1.chalk.green('> [process]: ') + package_exports_1.chalk.grey('loading') + package_exports_1.chalk.blue('.env') + package_exports_1.chalk.grey(' file'));
(0, dotenv_1.config)();
(0, package_exports_1.log)(package_exports_1.chalk.green('> [ok]: ') + package_exports_1.chalk.grey('data loaded from ') + package_exports_1.chalk.blue('.env'));
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
app.use((0, cors_1.default)({
    origin: "*",
    methods: ["GET", "POST"]
}));
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '300mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static('public'));
let PORT = process.env.SERVER_PORT || 7071;
let userCred;
let socket;
const loadCredAndSysDetails = () => __awaiter(void 0, void 0, void 0, function* () {
    userCred = yield mode_1.MachineID.findOne({
        where: {
            id: package_exports_1.machineId,
        }
    });
    console.log(userCred);
});
const main = (loadData) => __awaiter(void 0, void 0, void 0, function* () {
    socket = yield (0, socket_1.client)(userCred, 'https://lpcio.booringcodes.in');
    (0, api_1.apiAccessPoint)(app, loadData, () => __awaiter(void 0, void 0, void 0, function* () {
        socket.disconnect();
        socket.connect();
    }));
    server.listen(PORT, () => {
        (0, package_exports_1.log)(package_exports_1.chalk.green('> [OK]: ') + package_exports_1.chalk.blue('server is running '));
        (0, package_exports_1.log)(package_exports_1.chalk.green('> [info]: ') + package_exports_1.chalk.grey(PORT.toString()));
        (0, package_exports_1.log)(package_exports_1.chalk.green('> [OK]: ') + package_exports_1.chalk.blue('https://lpcio.booringcodes.in'));
    });
    (0, local_events_1.events)(socket);
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, connection_1.dbConnection)();
        yield loadCredAndSysDetails();
        yield main(loadCredAndSysDetails);
    }
    catch (error) {
        console.log(package_exports_1.chalk.red('> [error]: '), error);
    }
}))();
//# sourceMappingURL=server.js.map