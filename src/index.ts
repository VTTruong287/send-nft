import path from "path";

import ContractABI from './consts/abi.json';
import { ARB, SepoliaARB } from "./consts/networks";
import { Blockchain, SpreadSheet } from "./controllers";
import RowJob from "./models/rowJob";

import "dotenv/config";
import { TransactionReceiptStatus } from "./consts/config";
import { ProcessStatusEnum } from "./models/row";
import { extractTokenIdAndAmount } from "./ultils";

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
  // ...
  // const tokenIds = [TokenID.NATURE, TokenID.FIRE, TokenID.WATER, TokenID.EARTH, TokenID.DARK, TokenID.LIGHTNING, TokenID.AETHER]
  // const mintAmounts = [spreadSheet.rows[0].nature, spreadSheet.rows[0].fire, spreadSheet.rows[0].water, spreadSheet.rows[0].earth, spreadSheet.rows[0].dark, spreadSheet.rows[0].lightning, spreadSheet.rows[0].aether]
  const {tokenIds, amounts: mintAmounts} = extractTokenIdAndAmount(spreadSheet.rows[0])
  const addresses = tokenIds.map(() => fromAddress)
  const originBalances = await blockchain.getBalances(addresses, tokenIds)
  const rowJobs: RowJob[] = [];

  console.log('originBalances: ', originBalances)
  if (originBalances?.length == 0) throw Error('--- Error getBalances')

  // Mint
  const mintRs = await blockchain.mintBatch(fromAddress, privateKey, tokenIds, mintAmounts);
  if (!!mintRs.errorMsg || mintRs.rs?.status != TransactionReceiptStatus.SUCCESS) {
    throw Error("--- Error mintBatch ")
  }
  console.log('Mint successfully ')

  // TODO: Quantity Checking Loop when mint successfully
  // ...
  const afterMintBalances = await blockchain.getBalances(addresses, tokenIds)
  if (afterMintBalances?.length == 0) throw Error('--- Error getBalances')
  console.log('afterMintBalances: ', afterMintBalances)
  
  // Wait and check mint is enough
  for (let i = 0; i < mintAmounts.length; i++) {
    if (afterMintBalances[i] - originBalances[i] != mintAmounts[i]) {
      // TODO: Burn for Rollback ???
      // ...
      throw Error("Wrongly mint amount")
    }
  }

  // Transfer
  // Skip idx = 0: total row
  for (let i = 1; i < spreadSheet.rows.length; i++) {
    rowJobs.push(new RowJob(spreadSheet.rows[i], blockchain, fromAddress));
  }

  for (let rowJob of rowJobs) {
    await rowJob.process();
  }
  
  // TODO: paralell process
  // ...

  const afterTransferBalances = await blockchain.getBalances(addresses, tokenIds)
  if (afterTransferBalances?.length == 0) throw Error('--- Error getBalances')
  console.log('afterTransferBalances: ', afterTransferBalances)

  // Export
  await spreadSheet.export();

};

main();
