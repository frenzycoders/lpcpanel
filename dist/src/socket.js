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
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const package_exports_1 = require("./../package_exports");
const socket_io_client_1 = require("socket.io-client");
const client = (userCred, url) => __awaiter(void 0, void 0, void 0, function* () {
    (0, package_exports_1.log)(package_exports_1.chalk.greenBright('> [process]: ') + package_exports_1.chalk.blue('starting socket server'));
    package_exports_1.spinner.start();
    const socket = (0, socket_io_client_1.io)(url, {
        extraHeaders: {
            id: userCred ? userCred.id : 'empty',
            usertype: "Machine",
        },
    });
    package_exports_1.spinner.stop(true);
    (0, package_exports_1.log)(package_exports_1.chalk.greenBright('> [OK]: ') + package_exports_1.chalk.blue('socket server is started on ') + package_exports_1.chalk.grey(url));
    return socket;
});
exports.client = client;
//# sourceMappingURL=socket.js.map