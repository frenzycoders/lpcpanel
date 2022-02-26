#!/usr/bin/env node
import { argv } from 'process';
import { chalk, readline, spinner, pm2 } from './package_exports';
import { isValidObjectId, ObjectId, } from 'mongoose'
import { writeFile } from 'fs-extra';

const main = async () => {
    let args = argv[2];
    if (args == "setup") {
        console.log(chalk.green('> [Process]: setup your machine'))
        let ans: string = readline.question(chalk.blueBright("> Please enter your id: "))
        if (isValidObjectId(ans)) {
            console.log(chalk.green('> [process]: ') + chalk.gray('setting up your id :') + chalk.yellow(ans))
            spinner.start()
            await writeFile(__dirname + '/usercred.json', `{"id":"${ans}"}`);
            spinner.stop(true)
            console.log(chalk.green('> [OK]: ') + chalk.blue('id setup completed'))
            console.log(chalk.green('> [info]: ') + chalk.blue('now access your pc/laptop lc-manager web or mobile application'));
        } else {
            console.log(chalk.red('> [error]: ') + chalk.red('Invalid id please enter valid id'));
            process.exit(0)
        }
    }
    else if (args == 'start') {
        console.log(chalk.green('> [process]: ') + chalk.green('starting local server'))
        spinner.start()
        pm2.start({ name: 'lc-manager', script: __dirname + '/dist/src/server.js' }, (err: Error) => {
            if (err) {

                console.log(chalk.red('> [process]: ') + chalk.redBright('Error in launching process'), err)
            } else {
                console.log(chalk.green('> [OK]: ') + chalk.green('server started now you can access your pc/laptop using lc-manager web or mobile application'))
            }
            spinner.stop(true);;
            pm2.disconnect()
        })
    }
    else if (args == 'stop') {
        console.log(chalk.red('> [process]: ') + chalk.red('stopping lpcpanel'))
        spinner.start()
        pm2.delete('lc-manager', (err) => {
            if (err) {
                console.log(chalk.red('> [error]: ') + chalk.red('error in deleting process please retry  or please start server first'))
            } else {
                console.log(chalk.green('> [process]: ') + chalk.greenBright('process removed from your pc thank you'))
            }
            spinner.stop(true);
            pm2.disconnect()
        })
    }
}
main();
