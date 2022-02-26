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
exports.apiAccessPoint = void 0;
const fs_1 = require("fs");
const apiAccessPoint = (app, loadData, reloadSocet) => __awaiter(void 0, void 0, void 0, function* () {
    app.post('/change-credentials', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.body;
            (0, fs_1.writeFileSync)(__dirname + '/usercred.json', `{"id":"${id}"}`);
            let data = JSON.parse((0, fs_1.readFileSync)(__dirname + '/usercred.json', { encoding: 'utf-8' }));
            yield loadData();
            reloadSocet();
            res.status(201).send({ message: "Id updated", data });
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ message: error.message });
        }
    }));
    app.get('/cred', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if ((0, fs_1.existsSync)(__dirname + '/usercred.json')) {
                let data = (0, fs_1.readFileSync)(__dirname + '/usercred.json', { encoding: 'utf-8' });
                data = JSON.parse(data);
                console.log(data);
                res.status(200).send(data);
            }
            else
                res.status(404).send({ message: "Not found" });
        }
        catch (error) {
            res.status(500).send({ message: error.message });
        }
    }));
});
exports.apiAccessPoint = apiAccessPoint;
//# sourceMappingURL=api.js.map