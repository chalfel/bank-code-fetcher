import express from "express";
import cors from "cors";
import axios from "axios";
import csv from "csvtojson/v2";

const fetchBankCodeData = async () => {
  const { data } = await axios.get(
    "http://www.bcb.gov.br/pom/spb/estatistica/port/ParticipantesSTRport.csv"
  );
  return csv().fromString(data);
};
const main = async () => {
  const app = express();
  const bankCodes = await fetchBankCodeData();

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
  app.listen(process.env.PORT || 3333, () =>
    console.log(`application is running on port ${process.env.PORT || 3333}`)
  );
};

main();
