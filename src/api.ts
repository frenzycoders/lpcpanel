import { Application, Request, Response } from "express";
import { writeFileSync, existsSync, readFileSync } from 'fs'
import { machineId } from "./../package_exports";
import { MachineID } from "./mode";

export const apiAccessPoint = async (app: Application, loadData: Function, reloadSocet: Function) => {
    app.post('/change-credentials', async (req: Request, res: Response) => {
        try {
            const { id } = req.body;
            let data = await MachineID.findOne({ where: {
                id:machineId,
            }});
            if (!data) {
                data = MachineID.create({ id: machineId, value: id, status: false });
                await data.save()
            }else{
                data.value = id;
                await data.save()
            }
            loadData().then(()=>{
                reloadSocet();
            });
            
            res.status(201).send({ message: "Id updated", data });
        } catch (error: any) {
            console.log(error);
            res.status(500).send({ message: error.message });
        }
    });

    app.get('/cred', async (req: Request, res: Response) => {
        try {
            let data = await MachineID.findOne({ where: { id: machineId } });
            if(!data) return res.status(404).send()
            else res.status(200).send(data)
        } catch (error: any) {
            res.status(500).send({ message: error.message });
        }
    });
} 