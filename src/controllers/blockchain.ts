import Web3, { TransactionReceipt } from "web3";

import { Network } from "@src/consts/networks";

export default class Blockchain {
  public provider: Web3;
  public network: Network;
  public currentNetworkIdx: number;
  public nonce: bigint;

  public contractAddress: string;
  public contract;

  constructor(network: Network, abi: any, contractAddress: string) {
    this.network = network;
    // FetchError: invalid json response body at https://sepolia.infura.io/v3/ reason: Unexpected token 'p', "project id"... is not valid JSON
    this.currentNetworkIdx = 0;
    this.nonce = 0n;
    this.provider = new Web3(network.RPCs[this.currentNetworkIdx]);

    this.contractAddress = contractAddress;
    this.contract = new this.provider.eth.Contract(abi, contractAddress);
  }

  /**
   * getBalances
   * @param fromAddresses 
   * @param ids 
   * @returns 
   */
  public async getBalances(fromAddresses: string[], ids: bigint[]): Promise<bigint[]> {
    if (!this.contract || !this.contractAddress) throw Error("Contract is not initialized!");

    console.log("getBalances params: ", fromAddresses, ids);
    try {
      const rs = await this.contract.methods.balanceOfBatch(fromAddresses, ids).call();
      return rs as any;
    } catch (error) {
      console.log("Error - getBalances: ", error);
      return [];
    }
  }

  /**
   * mintBatch
   * @param fromAddress 
   * @param privateKey 
   * @param ids 
   * @param amounts 
   * @returns 
   */
  public async mintBatch(
    fromAddress: string,
    privateKey: string,
    ids: bigint[],
    amounts: bigint[]
  ): Promise<{
    rs: TransactionReceipt;
    errorMsg: string;
  }> {
    if (!this.contract || !this.contractAddress) throw Error("Contract is not initialized!");
    if (ids.length == 0 || amounts.length == 0 || ids.length != amounts.length) throw Error("Wrong paramaters");
    try {
      console.log("minBatch params: ", fromAddress, ids, amounts);
      const transfer = this.contract.methods.mintBatch(fromAddress, ids, amounts, []);
      // const transfer = this.contract.methods.mint(fromAddress, ids[0], amounts[0], []);
      const encodedABI = transfer.encodeABI();

      const gasLimit = 21000n * 15n; // Gas limit
      const gasPrice = await this.provider.eth.getGasPrice();

      const tx = {
        from: fromAddress,
        to: this.contractAddress,
        // gas: this.provider.utils.toHex(2000000),
        gasLimit: this.provider.utils.toHex(gasLimit),
        gasPrice: this.provider.utils.toHex(gasPrice + 10000000n),
        data: encodedABI,
      };

      const signed = await this.provider.eth.accounts.signTransaction(tx, privateKey);
      const tran = await this.provider.eth.sendSignedTransaction(signed.rawTransaction);

      return {
        rs: tran,
        errorMsg: "",
      };
    } catch (error) {
      console.log("Error - getBalances: ", error);
      return {
        rs: null,
        errorMsg: `Code: ${error.code} - Content: ${error.message}`,
      };
    }
  }

  /**
   * safeBatchTransferFrom
   * @param fromAddress 
   * @param privateKey 
   * @param toAddress 
   * @param ids 
   * @param amounts 
   * @returns 
   */
  public async safeBatchTransferFrom(fromAddress: string, privateKey: string, toAddress: string, ids: bigint[], amounts: bigint[]) {
    if (!this.contract || !this.contractAddress) throw Error("Contract is not initialized!");
    if (ids.length == 0 || amounts.length == 0 || ids.length != amounts.length) throw Error("Wrong paramaters");
    try {
      console.log("safeBatchTransferFrom params: ", fromAddress, toAddress, ids, amounts);
      const transfer = this.contract.methods.safeBatchTransferFrom(fromAddress, toAddress, ids, amounts, []);
      // const transfer = this.contract.methods.mint(fromAddress, ids[0], amounts[0], []);
      const encodedABI = transfer.encodeABI();

      const gasLimit = 21000n * 15n; // Gas limit
      const gasPrice = await this.provider.eth.getGasPrice();

      const tx = {
        from: fromAddress,
        to: this.contractAddress,
        // gas: this.provider.utils.toHex(2000000),
        gasLimit: this.provider.utils.toHex(gasLimit),
        gasPrice: this.provider.utils.toHex(gasPrice + 10000000n),
        data: encodedABI,
      };

      const signed = await this.provider.eth.accounts.signTransaction(tx, privateKey);
      const tran = await this.provider.eth.sendSignedTransaction(signed.rawTransaction);

      return {
        rs: tran,
        errorMsg: "",
      };
    } catch (error) {
      console.log("Error - getBalances: ", error);
      return {
        rs: null,
        errorMsg: `Code: ${error.code} - Content: ${error.message}`,
      };
    }
  }
}
