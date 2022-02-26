import { argv } from 'process';
import pm from 'pm2';
import readlineSync from 'readline-sync';
import { Spinner } from 'cli-spinner';
import c from 'chalk';
import { version } from './package.json'

export const spinner = new Spinner({
    stream: process.stderr,
    onTick: function (msg) {
        this.clearLine(this.stream);
        this.stream.write(msg);
    }
});
spinner.setSpinnerString('|/-\\');



export const log = console.log;
export const pm2 = pm;
export const chalk = c;
export const v = version;
export const readline = readlineSync;
export const machineId = 'machineId';