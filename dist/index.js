#!/usr/bin/env node
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
const process_1 = require("process");
const package_exports_1 = require("./package_exports");
const mongoose_1 = require("mongoose");
const mode_1 = require("./src/mode");
const connection_1 = require("./src/connection");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, connection_1.dbConnection)();
    let args = process_1.argv[2];
    if (args == "setup") {
        console.log(package_exports_1.chalk.green('> [Process]: setup your machine'));
        let ans = package_exports_1.readline.question(package_exports_1.chalk.blueBright("> Please enter your id: "));
        if ((0, mongoose_1.isValidObjectId)(ans)) {
            console.log(package_exports_1.chalk.green('> [process]: ') + package_exports_1.chalk.gray('setting up your id :') + package_exports_1.chalk.yellow(ans));
            package_exports_1.spinner.start();
            let data = yield mode_1.MachineID.findOne({
                where: {
                    id: package_exports_1.machineId,
                }
            });
            if (!data) {
                yield mode_1.MachineID.create({ id: package_exports_1.machineId, value: ans, status: false });
            }
            else {
                data.value = ans;
                yield data.save();
            }
            package_exports_1.spinner.stop(true);
            console.log(package_exports_1.chalk.green('> [OK]: ') + package_exports_1.chalk.blue('id setup completed'));
            console.log(package_exports_1.chalk.green('> [info]: ') + package_exports_1.chalk.blue('now access your pc/laptop lc-manager web or mobile application'));
        }
        else {
            console.log(package_exports_1.chalk.red('> [error]: ') + package_exports_1.chalk.red('Invalid id please enter valid id'));
            process.exit(0);
        }
    }
    else if (args == 'start') {
        console.log(package_exports_1.chalk.green('> [process]: ') + package_exports_1.chalk.green('starting local server'));
        package_exports_1.spinner.start();
        package_exports_1.pm2.start({ name: 'lc-manager', script: __dirname + '/src/server.js' }, (err) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                yield mode_1.MachineID.update({
                    id: package_exports_1.machineId,
                }, { status: false });
                console.log(package_exports_1.chalk.red('> [process]: ') + package_exports_1.chalk.redBright('Error in launching process'), err);
            }
            else {
                yield mode_1.MachineID.update({
                    id: package_exports_1.machineId,
                }, { status: true });
                console.log(package_exports_1.chalk.green('> [OK]: ') + package_exports_1.chalk.green('server started now you can access your pc/laptop using lc-manager web or mobile application'));
            }
            package_exports_1.spinner.stop(true);
            ;
            package_exports_1.pm2.disconnect();
        }));
    }
    else if (args == 'stop') {
        console.log(package_exports_1.chalk.red('> [process]: ') + package_exports_1.chalk.red('stopping lpcpanel'));
        package_exports_1.spinner.start();
        package_exports_1.pm2.delete('lc-manager', (err) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                console.log(package_exports_1.chalk.red('> [error]: ') + package_exports_1.chalk.red('error in deleting process please retry  or please start server first'));
            }
            else {
                yield mode_1.MachineID.update({
                    id: package_exports_1.machineId,
                }, { status: false });
                console.log(package_exports_1.chalk.green('> [process]: ') + package_exports_1.chalk.greenBright('process removed from your pc thank you'));
            }
            package_exports_1.spinner.stop(true);
            package_exports_1.pm2.disconnect();
        }));
    }
    else if (args == 'status') {
        console.log(package_exports_1.chalk.green('> [process]: ') + package_exports_1.chalk.green('loading server status'));
        package_exports_1.spinner.start();
        let machine = yield mode_1.MachineID.findOne({
            where: {
                id: package_exports_1.machineId
            }
        });
        if (!machine) {
            console.log(package_exports_1.chalk.red('> [error]: ') + package_exports_1.chalk.redBright('Please setup first'));
            process.exit(0);
        }
        else {
            console.log(package_exports_1.chalk.green('> [status]: ') + package_exports_1.chalk.blue('Server status is : ') + machine.status ? package_exports_1.chalk.green('True') : package_exports_1.chalk.red('False'));
            process.exit();
        }
    }
    else {
        console.log(package_exports_1.chalk.red('> [error]: ') + package_exports_1.chalk.blue('Invalid cmd'));
    }
});
main();
{
    mode_1.MachineID;
}
{
    mode_1.MachineID;
}
{
    mode_1.MachineID;
}
//# sourceMappingURL=index.js.map