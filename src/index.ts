import path from "path";

import { ARB, SepoliaARB } from "./consts/networks";
import { Blockchain, SpreadSheet } from "./controllers";
import RowJob from "./models/rowJob";

import "dotenv/config";

const main = async () => {
  const fromAddress = process.env.FROM_ADDRESS;
  const privateKey = process.env.PRIVATE_KEY;
  const network = !!process.env.TEST_MODE ? SepoliaARB : ARB
  console.log(" ********** Send crypto - Start ", network);

  if (!fromAddress || !privateKey || !network) {
    throw("From address, private key, network can not be empty")
  }

  const spreadSheet = new SpreadSheet(
    path.join(__dirname, "input/send.csv"), 
    path.join(__dirname, "output"), 
    "rs.csv"
  );
  const blockchain = new Blockchain(network, privateKey);
  const rowJobs: RowJob[] = [];

  await spreadSheet.getData();

  // for (let i = 0; i < spreadSheet.rows.length; i++) {
  //   rowJobs.push(new RowJob(spreadSheet.rows[i], blockchain, i, spreadSheet.rows.length))
  // }

  // for (let rowJob of rowJobs) {
  //   await rowJob.process();
  // }

  await spreadSheet.export();
};

main();
