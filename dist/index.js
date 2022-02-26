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
const fs_extra_1 = require("fs-extra");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    let args = process_1.argv[2];
    if (args == "setup") {
        console.log(package_exports_1.chalk.green('> [Process]: setup your machine'));
        let ans = package_exports_1.readline.question(package_exports_1.chalk.blueBright("> Please enter your id: "));
        if ((0, mongoose_1.isValidObjectId)(ans)) {
            console.log(package_exports_1.chalk.green('> [process]: ') + package_exports_1.chalk.gray('setting up your id :') + package_exports_1.chalk.yellow(ans));
            package_exports_1.spinner.start();
            yield (0, fs_extra_1.writeFile)(__dirname + '/usercred.json', `{"id":"${ans}"}`);
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
        package_exports_1.pm2.start({ name: 'lc-manager', script: __dirname + '/dist/src/server.js' }, (err) => {
            if (err) {
                console.log(package_exports_1.chalk.red('> [process]: ') + package_exports_1.chalk.redBright('Error in launching process'), err);
            }
            else {
                console.log(package_exports_1.chalk.green('> [OK]: ') + package_exports_1.chalk.green('server started now you can access your pc/laptop using lc-manager web or mobile application'));
            }
            package_exports_1.spinner.stop(true);
            ;
            package_exports_1.pm2.disconnect();
        });
    }
    else if (args == 'stop') {
        console.log(package_exports_1.chalk.red('> [process]: ') + package_exports_1.chalk.red('stopping lpcpanel'));
        package_exports_1.spinner.start();
        package_exports_1.pm2.delete('lc-manager', (err) => {
            if (err) {
                console.log(package_exports_1.chalk.red('> [error]: ') + package_exports_1.chalk.red('error in deleting process please retry  or please start server first'));
            }
            else {
                console.log(package_exports_1.chalk.green('> [process]: ') + package_exports_1.chalk.greenBright('process removed from your pc thank you'));
            }
            package_exports_1.spinner.stop(true);
            package_exports_1.pm2.disconnect();
        });
    }
});
main();
//# sourceMappingURL=index.js.map