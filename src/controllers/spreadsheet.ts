import fs from "fs";
import os from "os";

import { ProcessStatusEnum, Row } from "@src/models/row";

export default class SpreadSheet {
  public rows: Row[];
  public inputFilePath: string;
  public outFileDirectory: string;
  public outFileName: string;

  constructor(inputFilePath: string, outFileDirectory: string, outFileName: string) {
    this.rows = [];
    this.inputFilePath = inputFilePath;
    this.outFileDirectory = outFileDirectory;
    this.outFileName = outFileName;
  }

  /**
   * getData
   * Get data from csv file with initialize input path
   */
  public async getData() {
    try {
      // Get data from file Path
      const content = await fs.promises.readFile(this.inputFilePath, "utf-8");
      const rows = content.split(os.EOL);

      rows?.forEach((row, idx) => {
        if (idx == 0) return;
        const columns = row.replace("\r", "").replace("\n", "").split(",")
        try {
          // Check and parse the amount
          const natureAmount = BigInt(columns[2]?.trim())
          const fireAmount = BigInt(columns[3]?.trim())
          const waterAmount = BigInt(columns[4]?.trim())
          const earthAmount = BigInt(columns[5]?.trim())
          const darkAmount = BigInt(columns[6]?.trim())
          const lightningAmount = BigInt(columns[7]?.trim())
          const aetherAmount = BigInt(columns[8]?.trim())

          this.rows.push({
            address: columns[0]?.trim(),
            points: columns[1]?.trim(),

            nature: natureAmount,
            fire: fireAmount,
            water: waterAmount,
            earth: earthAmount,
            dark: darkAmount,
            lightning: lightningAmount,
            aether: aetherAmount,

            transactionId: "",
            status: ProcessStatusEnum.NONE,
            errorMsg: ""
          })
        } catch (error) {
          this.rows.push({
            address: columns[0],
            points: columns[1],
            transactionId: "",
            status: ProcessStatusEnum.FAIL,
            errorMsg: "Error when get Data"
          })
        }
      })
      
      // console.log("content: ", this.rows)
    } catch(error) {
      console.log('--- getData - Error: ', error)
    }
  }

  /**
   * export
   * Write result after process to csv file
   */
  public async export() {
    if (!!this.rows) {
      let csvRows = [];
      csvRows.push("Address,Points,Nature,Fire,Water,Earth,Dark,Lightning,Aether,Transaction Id,Status,Error message");
      this.rows.forEach((row, idx) => {
        csvRows.push(
          [
            row.address,
            row.points,
            row.nature,
            row.fire,
            row.water,
            row.earth,
            row.dark,
            row.lightning,
            row.aether,
            row.transactionId,
            row.status,
            row.errorMsg,
          ].join(",")
        );
      });

      if (!fs.existsSync(this.outFileDirectory)) {
        await fs.promises.mkdir(this.outFileDirectory, { recursive: true });
      }
      await fs.promises.writeFile(`${this.outFileDirectory}/${this.outFileName}`, csvRows.join(os.EOL), "utf-8");
      
      console.log("Export complete!!!");
    } else {
      console.log("ERR rows");
    }
  }
}
