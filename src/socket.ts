import { chalk, log, spinner } from "./../package_exports";
import { io } from "socket.io-client";

export const client = async (userCred: any, url: string) => {
    log(chalk.greenBright('> [process]: ') + chalk.blue('starting socket server'));
    spinner.start();

    const socket = io(url, {
        extraHeaders: {
            id: userCred ? userCred.value : 'empty',
            usertype: "Machine",
        },
    });

    spinner.stop(true);
    log(chalk.greenBright('> [OK]: ') + chalk.blue('socket server is started on ') + chalk.grey(url));
    return socket;
}