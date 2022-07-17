import { createServer } from "http"
import express from 'express';
import { Socket } from 'socket.io-client'
import { client } from "./socket";
import { existsSync, readFileSync } from 'fs';
import cors from 'cors';
import { events } from "./local_events";
import { config } from 'dotenv';
import { apiAccessPoint } from "./api";
import { chalk, log, machineId, spinner } from "./../package_exports";
import { dbConnection } from "./connection";
import { MachineID } from "./mode";

log(chalk.green('> [process]: ') + chalk.grey('loading') + chalk.blue('.env') + chalk.grey(' file'));
config();
log(chalk.green('> [ok]: ') + chalk.grey('data loaded from ') + chalk.blue('.env'));

const app = express();
const server = createServer(app);

app.use(cors({
    origin: "*",
    methods: ["GET", "POST"]
}));

app.use(cors())
app.use(express.json({ limit: '300mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

let PORT = process.env.SERVER_PORT || 7071;

let userCred: any;
let socket: Socket;


const loadCredAndSysDetails = async () => {
    userCred = await MachineID.findOne({
        where: {
            id: machineId,
        }
    });
    console.log(userCred)
}




const main = async (loadData: Function) => {


    socket = await client(userCred, 'http://socket.lc-manager.myportfolio.club');


    apiAccessPoint(app, loadData, async () => {
        socket.disconnect();
        socket.connect();
    });


    server.listen(PORT, () => {

        log(chalk.green('> [OK]: ') + chalk.blue('server is running '))
        log(chalk.green('> [info]: ') + chalk.grey(PORT.toString()));
        log(chalk.green('> [OK]: ') + chalk.blue('http://socket.lc-manager.myportfolio.club'));
    })
    events(socket);
}

(async () => {
    try {
        await dbConnection()
        await loadCredAndSysDetails()
        await main(loadCredAndSysDetails);
    } catch (error) {
        console.log(chalk.red('> [error]: '), error);
    }
})()




