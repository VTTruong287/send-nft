import Web3, { Contract, FMT_NUMBER, Transaction, TransactionReceipt, Web3EthInterface } from "web3";

import { Network } from "@src/consts/networks";
import { TokenID } from "@src/consts/config";

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

    this.contractAddress = contractAddress
    this.contract = new this.provider.eth.Contract(abi, contractAddress)
  }

  public async testMethod (contractAddress: string, abi: any, fromAddress: string, privateKey: string) {
    if (!this.contract) throw("Contract is not initialized!")

    // const rs = await this.contract.methods.totalSupply(TokenID.WATER).call()
    // const rs = await this.contract.methods.balanceOf("0xC6f9D937Bb6a6884004fAb2Fe139A1543Ee70a55", 1).call()
    // const rs = await this.contract.methods.CHAOS().call()

    var contract = new this.provider.eth.Contract(abi, contractAddress);
    var transfer = contract.methods.mint(fromAddress, TokenID.WATER, 3n, []);
    var encodedABI = transfer.encodeABI();

    const gasLimit = 184000n; // Gas limit
    const gasPrice = await this.provider.eth.getGasPrice();
console.log('this.provider.utils.toHex(gasPrice + 1000000n): ', gasPrice + 1000000n)
    // max fee per gas less than block base fee: address 0xC6f9D937Bb6a6884004fAb2Fe139A1543Ee70a55, maxFeePerGas: 1232320000, baseFee: 1236960000'

    var tx = {
      from: fromAddress,
      to: contractAddress,
      // gas: this.provider.utils.toHex(2000000),
      gasLimit: this.provider.utils.toHex(gasLimit),
      gasPrice: this.provider.utils.toHex(gasPrice + 10000000n),
      data: encodedABI
    }; 

    this.provider.eth.accounts.signTransaction(tx, privateKey).then(signed => {
      var tran = this.provider.eth.sendSignedTransaction(signed.rawTransaction);
  
      tran.on('confirmation', (confirmationNumber: any) => {
        console.log('confirmation: ', confirmationNumber);
        // console.log('receipt: ', receipt);
      });
  
      tran.on('transactionHash', hash => {
        console.log('hash');
        console.log(hash);
      });
  
      tran.on('receipt', receipt => {
        console.log('reciept');
        console.log(receipt);
      });
  
      tran.on('error', console.error);
    });
    // const rs = await this.contract.methods.mint("0xC6f9D937Bb6a6884004fAb2Fe139A1543Ee70a55", TokenID.WATER, 3n, []).send()

    // console.log('--- Result: ', rs)
  }

  public async getBalances(fromAddresses: string[], ids: bigint[]): Promise<bigint[]> {
    if (!this.contract || !this.contractAddress) throw Error("Contract is not initialized!");

    console.log('getBalances params: ', fromAddresses, ids)
    try {
      const rs = await this.contract.methods.balanceOfBatch(fromAddresses, ids).call()
      return rs as any;
    } catch (error) {
      console.log('Error - getBalances: ', error)
      return [];
    }
  }

  public async mintBatch (fromAddress: string, privateKey: string, ids: bigint[], amounts: bigint[]): Promise<{
    rs: TransactionReceipt,
    errorMsg: string
  }> {
    if (!this.contract || !this.contractAddress) throw Error("Contract is not initialized!");
    if (ids.length == 0 || amounts.length == 0 || ids.length != amounts.length) throw Error("Wrong paramaters");
    try {
      console.log('minBatch params: ', fromAddress, ids, amounts)
      const transfer = this.contract.methods.mintBatch(fromAddress, ids, amounts, []);
      // const transfer = this.contract.methods.mint(fromAddress, ids[0], amounts[0], []);
      const encodedABI = transfer.encodeABI();

      const gasLimit = 584000n; // Gas limit
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
      console.log('Error - getBalances: ', error)
      return {
        rs: null,
        errorMsg: `Code: ${error.code} - Content: ${error.message}`,
      };
    }
  }

  public async safeBatchTransferFrom(fromAddress: string, privateKey: string, toAddress: string, ids: bigint[], amounts: bigint[]) {
    if (!this.contract || !this.contractAddress) throw Error("Contract is not initialized!");
    if (ids.length == 0 || amounts.length == 0 || ids.length != amounts.length) throw Error("Wrong paramaters");
    try {
      console.log('safeBatchTransferFrom params: ', fromAddress, toAddress, ids, amounts)
      const transfer = this.contract.methods.safeBatchTransferFrom(fromAddress, toAddress, ids, amounts, []);
      // const transfer = this.contract.methods.mint(fromAddress, ids[0], amounts[0], []);
      const encodedABI = transfer.encodeABI();

      const gasLimit = 584000n; // Gas limit
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
      console.log('Error - getBalances: ', error)
      return {
        rs: null,
        errorMsg: `Code: ${error.code} - Content: ${error.message}`,
      };
    }
  }

  /**
   * sendNativeCoin
   * @param fromAddress 
   * @param toAddress 
   * @param amount 
   * @param privateKey 
   * @param increament 
   * @returns 
   */
  public async sendNativeCoin(fromAddress: string, toAddress: string, amount: string, privateKey: string, increament: number): Promise<{
    rs: TransactionReceipt,
    errorMsg: string
  }> {
    /*
    Transaction receipt: {
      blockHash: '0x2324b73b4faa3a498daa19a313aafdd8f7456082395c3fe81c34104f444002a3',
      blockNumber: 5640655n,
      cumulativeGasUsed: 24861125n,
      effectiveGasPrice: 1000447579n,
      from: '0xc6f9d937bb6a6884004fab2fe139a1543ee70a55',
      gasUsed: 21000n,
      logs: [],
      logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
      status: 1n,
      to: '0xe84c387b8cb670241f49f70e1fd8f110f74d0f02',
      transactionHash: '0x4ef08966195a3bd1fcb895538e8d5780265aed02d1f2b62fa9ea4a0a7993a141',
      transactionIndex: 56n,
      type: 0n
    }
    */
    try {
      // var count = (await this.provider.eth.getTransactionCount(fromAddress)) + BigInt(increament);
      const privateKeyBuffer = Buffer.from(privateKey, 'hex');
      const amountToSend = this.provider.utils.toWei(amount, "ether");
      const gas = 84000; // Gas limit
      const gasPrice = await this.provider.eth.getGasPrice();
      const txObject: Transaction = {
        from: fromAddress,
        to: toAddress,
        value: amountToSend,
        gasLimit: this.provider.utils.toHex(gas),
        gasPrice: this.provider.utils.toHex(gasPrice + 1000000n),
        // nonce: Web3.utils.toHex(count)
      };
      console.log('txObject: ', txObject);

      const signedTx = await this.provider.eth.accounts.signTransaction(txObject, privateKeyBuffer);
      const receipt = await this.provider.eth.sendSignedTransaction(signedTx.rawTransaction);

      console.log('Transaction receipt:', receipt);
      return {
        rs: receipt,
        errorMsg: null
      };
    } catch (error) {
      console.log('ERR - send: ', error);
      return {
        rs: null,
        errorMsg: `Code: ${error.code} - Content: ${error.message}`
      };
    }
  }
}
