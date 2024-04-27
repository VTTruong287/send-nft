import { MAX_RETRY_LIMIT, TransactionReceiptStatus } from "@src/consts/config";
import { ProcessStatusEnum, Row } from "./row";
import { Blockchain } from "@src/controllers";

export default class RowJob {
  public retry: number;
  public row: Row;
  public blockchain: Blockchain;
  public increament: number;
  public range: number;

  constructor(row: Row, blockchain: Blockchain, increament: number, range: number) {
    this.retry = 0;
    this.row = row;
    this.blockchain = blockchain;
    this.increament = increament;
    this.range = range;
  }

  /**
   * process
   * @returns 
   */
  public async process() {
    while (this.retry < MAX_RETRY_LIMIT && this.row.status == ProcessStatusEnum.NONE) {
      console.log('--- process: ', this.row.address, this.retry);
      const data = await this.blockchain.sendNativeCoin(process.env.FROM_ADDRESS, this.row.address, this.row.amount, process.env.PRIVATE_KEY, this.increament);
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
      this.increament += this.range * this.retry;

      // await new Promise((resolve, reject) =>
      //   setTimeout(() => {
      //     resolve(null);
      //   }, 500)
      // );
    }
  }
}
