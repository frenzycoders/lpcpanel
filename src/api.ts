import { Application, Request, Response } from "express";
import { writeFileSync, existsSync, readFileSync } from 'fs'

export const apiAccessPoint = async (app: Application, loadData: Function, reloadSocet: Function) => {
    app.post('/change-credentials', async (req: Request, res: Response) => {
        try {
            const { id } = req.body;
            writeFileSync(__dirname + '/usercred.json', `{"id":"${id}"}`);

            let data = JSON.parse(readFileSync(__dirname + '/usercred.json', { encoding: 'utf-8' }));
            await loadData();
            reloadSocet();

            res.status(201).send({ message: "Id updated", data });
        } catch (error: any) {
            console.log(error);
            res.status(500).send({ message: error.message });
        }
    });

    app.get('/cred', async (req: Request, res: Response) => {
        try {
            if (existsSync(__dirname + '/usercred.json')) {
                let data = readFileSync(__dirname + '/usercred.json', { encoding: 'utf-8' })
                data = JSON.parse(data);
                console.log(data)
                res.status(200).send(data);
            } else res.status(404).send({ message: "Not found" });
        } catch (error: any) {
            res.status(500).send({ message: error.message });
        }
    });
} 