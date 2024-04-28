import { MAX_RETRY_LIMIT, TransactionReceiptStatus } from "@src/consts/config";
import { Blockchain } from "@src/controllers";
import { extractTokenIdAndAmount } from "@src/ultils";
import { ProcessStatusEnum, Row } from "./row";

export default class RowJob {
  public index: number;
  public retry: number;
  public row: Row;
  public blockchain: Blockchain;

  public fromAddress: string;

  constructor(index: number, row: Row, blockchain: Blockchain, fromAddress: string) {
    this.index = index;
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
    // const tokenIds = [TokenID.NATURE, TokenID.FIRE, TokenID.WATER, TokenID.EARTH, TokenID.DARK, TokenID.LIGHTNING, TokenID.AETHER]
    // const transferAmounts = [this.row.nature, this.row.fire, this.row.water, this.row.earth, this.row.dark, this.row.lightning, this.row.aether]
    const { tokenIds, amounts: transferAmounts } = extractTokenIdAndAmount(this.row);

    while (this.retry < MAX_RETRY_LIMIT && this.row.status == ProcessStatusEnum.NONE) {
      console.log("--- process: ", this.index, this.row.address, this.retry);
      if (tokenIds.length == 0) {
        this.row.errorMsg = "Amounts are zero";
        this.row.status = ProcessStatusEnum.SUCCESS;
        return;
      }
      const data = await this.blockchain.safeBatchTransferFrom(
        this.fromAddress,
        process.env.PRIVATE_KEY,
        this.row.address,
        tokenIds,
        transferAmounts
      );
      if (data?.rs?.status) {
        this.row.transactionId = data.rs.transactionHash.toString();

        if (data.rs.status == TransactionReceiptStatus.SUCCESS) {
          this.row.errorMsg = "";
          this.row.status = ProcessStatusEnum.SUCCESS;
          return;
        }
      } else if (data?.errorMsg) {
        this.row.errorMsg = data.errorMsg;
      }
      if (this.retry >= MAX_RETRY_LIMIT - 1) {
        this.row.status = ProcessStatusEnum.FAIL;
        return;
      }
      this.retry++;

      await new Promise((resolve, reject) =>
        setTimeout(() => {
          resolve(null);
        }, 1000)
      );
    }
  }
}
