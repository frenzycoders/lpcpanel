import { join } from "path"
import { createConnection } from "typeorm"
import chalk from 'chalk';
import { Spinner } from "cli-spinner"
import { MachineID } from "./mode";

const spinner = new Spinner({
    stream: process.stderr,
    onTick: function (msg) {
        this.clearLine(this.stream);
        this.stream.write(msg);
    }
});
spinner.setSpinnerString('|/-\\');
export const dbConnection = async () => {
    try {
        console.log(chalk.green('> [process]: ') + chalk.blue('connecting to database..'));
        spinner.start();
        await createConnection({
            type: "sqlite",
            database: join(__dirname, 'database.db'),
            entities: [MachineID],
            synchronize: true,
        })
        spinner.stop(true);
        console.log(chalk.green('> [OK]: ') + chalk.greenBright('database connection status: ') + chalk.yellow('true'));
    } catch (error) {
        console.log(chalk.redBright('> [error]: ') + chalk.red('database connection error'))
        console.log(error.message);
        process.exit(0);
    }
}