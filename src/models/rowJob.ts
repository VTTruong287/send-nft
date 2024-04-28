import { MAX_RETRY_LIMIT, TokenID, TransactionReceiptStatus } from "@src/consts/config";
import { ProcessStatusEnum, Row } from "./row";
import { Blockchain } from "@src/controllers";

export default class RowJob {
  public retry: number;
  public row: Row;
  public blockchain: Blockchain;

  public fromAddress: string;

  constructor(row: Row, blockchain: Blockchain, fromAddress: string) {
    this.retry = 0;
    this.row = row;
    this.blockchain = blockchain;
    this.fromAddress = fromAddress;
  }

  /**
   * process
   * @returns 
   */
  public async process() {
    const tokenIds = [TokenID.NATURE, TokenID.FIRE, TokenID.WATER, TokenID.EARTH, TokenID.DARK, TokenID.LIGHTNING, TokenID.AETHER]
    const transferAmounts = [this.row.nature, this.row.fire, this.row.water, this.row.earth, this.row.dark, this.row.lightning, this.row.aether]

    while (this.retry < MAX_RETRY_LIMIT && this.row.status == ProcessStatusEnum.NONE) {
      console.log('--- process: ', this.row.address, this.retry);
      const data = await this.blockchain.safeBatchTransferFrom(this.fromAddress, process.env.PRIVATE_KEY, this.row.address, tokenIds, transferAmounts);
      if (data?.rs?.status) {
        this.row.transactionId = data.rs.transactionHash.toString();

        if (data.rs.status == TransactionReceiptStatus.SUCCESS) {
          this.row.errorMsg = "";
          this.row.status = ProcessStatusEnum.SUCCESS;
          return;
        }
      } else if (data?.errorMsg) {
        this.row.errorMsg = data.errorMsg
      }
      if (this.retry >= MAX_RETRY_LIMIT - 1 ) {
        this.row.status = ProcessStatusEnum.FAIL;
        return;
      }
      this.retry++;

      // await new Promise((resolve, reject) =>
      //   setTimeout(() => {
      //     resolve(null);
      //   }, 500)
      // );
    }
  }
}
