#!/usr/bin/env node
import { argv } from 'process';
import { chalk, readline, spinner, pm2, machineId } from './package_exports';
import { isValidObjectId, ObjectId, } from 'mongoose'
import { writeFile } from 'fs-extra';
import { MachineID } from './src/mode';
import { dbConnection } from './src/connection';

const main = async () => {
    await dbConnection()
    let args = argv[2];
    if (args == "setup") {
        console.log(chalk.green('> [Process]: setup your machine'))
        let ans: string = readline.question(chalk.blueBright("> Please enter your id: "))
        if (isValidObjectId(ans)) {
            console.log(chalk.green('> [process]: ') + chalk.gray('setting up your id :') + chalk.yellow(ans))
            spinner.start()
            let data = await MachineID.findOne({
                where: {
                    id: machineId,
                }
            })
            if (!data) {
                await MachineID.create({ id: machineId, value: ans, status: false });
            } else {
                data.value = ans
                await data.save();
            }
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
        pm2.start({ name: 'lc-manager', script: __dirname + '/src/server.js' }, async (err: Error) => {
            if (err) {
                await MachineID.update({
                    id: machineId,
                }, { status: false });
                console.log(chalk.red('> [process]: ') + chalk.redBright('Error in launching process'), err)
            } else {
                await MachineID.update({
                    id: machineId,
                }, { status: true });
                console.log(chalk.green('> [OK]: ') + chalk.green('server started now you can access your pc/laptop using lc-manager web or mobile application'))
            }
            spinner.stop(true);;
            pm2.disconnect()
        })
    }
    else if (args == 'stop') {
        console.log(chalk.red('> [process]: ') + chalk.red('stopping lpcpanel'))
        spinner.start()
        pm2.delete('lc-manager', async (err) => {
            if (err) {
                console.log(chalk.red('> [error]: ') + chalk.red('error in deleting process please retry  or please start server first'))
            } else {
                await MachineID.update({
                    id: machineId,
                }, { status: false });
                console.log(chalk.green('> [process]: ') + chalk.greenBright('process removed from your pc thank you'))
            }
            spinner.stop(true);
            pm2.disconnect()
        })
    }
    else if (args == 'status') {
        console.log(chalk.green('> [process]: ') + chalk.green('loading server status'))
        spinner.start()
        let machine = await MachineID.findOne({
            where: {
                id: machineId
            }
        })
        if(!machine) {
            console.log(chalk.red('> [error]: ')+chalk.redBright('Please setup first'))
            process.exit(0)
        }else{
            console.log(chalk.green('> [status]: ')+chalk.blue('Server status is : ')+machine.status ? chalk.green('True') : chalk.red('False'));
            process.exit()
        }
    }else{
        console.log(chalk.red('> [error]: ')+chalk.blue('Invalid cmd'))
    }
}
main();{ MachineID }
{ MachineID }{ MachineID }                                 