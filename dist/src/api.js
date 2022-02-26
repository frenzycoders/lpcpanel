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
const package_exports_1 = require("./../package_exports");
const mode_1 = require("./mode");
const apiAccessPoint = (app, loadData, reloadSocet) => __awaiter(void 0, void 0, void 0, function* () {
    app.post('/change-credentials', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.body;
            let data = yield mode_1.MachineID.findOne({ where: {
                    id: package_exports_1.machineId,
                } });
            if (!data) {
                data = mode_1.MachineID.create({ id: package_exports_1.machineId, value: id, status: false });
                yield data.save();
            }
            else {
                data.value = id;
                yield data.save();
            }
            loadData().then(() => {
                reloadSocet();
            });
            res.status(201).send({ message: "Id updated", data });
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ message: error.message });
        }
    }));
    app.get('/cred', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let data = yield mode_1.MachineID.findOne({ where: { id: package_exports_1.machineId } });
            if (!data)
                return res.status(404).send();
            else
                res.status(200).send(data);
        }
        catch (error) {
            res.status(500).send({ message: error.message });
        }
    }));
});
exports.apiAccessPoint = apiAccessPoint;
//# sourceMappingURL=api.js.map