import path from "path";

import { ARB, SepoliaARB } from "./consts/networks";
import { Blockchain, SpreadSheet } from "./controllers";
import RowJob from "./models/rowJob";
import ContractABI from './consts/abi.json';

import "dotenv/config";
import { ProcessStatusEnum } from "./models/row";
import { TokenID, TransactionReceiptStatus } from "./consts/config";

const main = async () => {
  const fromAddress = process.env.FROM_ADDRESS;
  const privateKey = process.env.PRIVATE_KEY;
  const contractAddress = process.env.CONTRACT_ADDRESS;
  const network = !!process.env.TEST_MODE ? SepoliaARB : ARB
  console.log(" ********** Send crypto - Start ", network);

  if (!fromAddress || !privateKey || !network) {
    throw("From address, private key, network can not be empty")
  }

  // Get data from csv: Address, quantity, Total mint
  const spreadSheet = new SpreadSheet(
    path.join(__dirname, "input/send.csv"), 
    path.join(__dirname, "output"), 
    "rs.csv"
  );
  const blockchain = new Blockchain(network, ContractABI, contractAddress);
  await spreadSheet.getData()

  if (spreadSheet.rows.length == 0) return
  if (spreadSheet.rows[0].status == ProcessStatusEnum.FAIL) throw Error("--- Total column is not exist")
  // TODO: Get flexible token list
  const tokenIds = [TokenID.NATURE, TokenID.FIRE, TokenID.WATER, TokenID.EARTH, TokenID.DARK, TokenID.LIGHTNING, TokenID.AETHER]
  const mintAmounts = [spreadSheet.rows[0].nature, spreadSheet.rows[0].fire, spreadSheet.rows[0].water, spreadSheet.rows[0].earth, spreadSheet.rows[0].dark, spreadSheet.rows[0].lightning, spreadSheet.rows[0].aether]
  const addresses = tokenIds.map(() => fromAddress)
  const originBalances = await blockchain.getBalances(addresses, tokenIds)

  console.log('originBalances: ', originBalances)
  if (originBalances?.length == 0) throw Error('--- Error getBalances')

  // Mint
  const mintRs = await blockchain.mintBatch(fromAddress, privateKey, tokenIds, mintAmounts);
  if (!!mintRs.errorMsg || mintRs.rs?.status != TransactionReceiptStatus.SUCCESS) {
    throw Error("--- Error mintBatch ")
  }
  console.log('mintRs: ', mintRs)

  // TODO: Quantity Checking Loop when mint successfully
  const afterMintBalances = await blockchain.getBalances(addresses, tokenIds)
  if (afterMintBalances?.length == 0) throw Error('--- Error getBalances')
  console.log('afterMintBalances: ', afterMintBalances)
  
  // Wait and check mint is enough
  for (let i = 0; i < mintAmounts.length; i++) {
    if (afterMintBalances[i] - originBalances[i] != mintAmounts[i]) {
      throw Error("Wrongly mint amount")
    }
  }

  // Transfer

  // Export







  // const rowJobs: RowJob[] = [];

  // await spreadSheet.getData();

  // for (let i = 0; i < spreadSheet.rows.length; i++) {
  //   rowJobs.push(new RowJob(spreadSheet.rows[i], blockchain, i, spreadSheet.rows.length))
  // }

  // for (let rowJob of rowJobs) {
  //   await rowJob.process();
  // }

  // await spreadSheet.export();
};

main();
