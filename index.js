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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const v2_1 = __importDefault(require("csvtojson/v2"));
const fetchBankCodeData = () => __awaiter(void 0, void 0, void 0, function* () {
    const { data } = yield axios_1.default.get("http://www.bcb.gov.br/pom/spb/estatistica/port/ParticipantesSTRport.csv");
    return (0, v2_1.default)().fromString(data);
});
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const app = (0, express_1.default)();
    const bankCodes = yield fetchBankCodeData();
    app.get("/", (req, res) => {
        const parsedBankCodes = bankCodes.map((item) => {
            return {
                Name: item["Nome_Reduzido"],
                Code: item["Número_Código"],
            };
        });
        return res
            .status(200)
            .json({ Success: true, Banks: JSON.stringify(parsedBankCodes) });
    });
    app.get("/full", (req, res) => {
        return res.status(200).json({ data: bankCodes });
    });
    app.listen(process.env.PORT || 3333, () => console.log(`application is running on port ${process.env.PORT || 3333}`));
});
main();