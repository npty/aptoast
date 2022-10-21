import { AptosAccount, AptosClient, HexString, MaybeHexString } from "aptos";
import { NODE_URL } from "../config";

export class CoinClient extends AptosClient {
  constructor() {
    super(NODE_URL);
  }

  async registerCoin(
    address: HexString,
    coinReceiver: AptosAccount
  ): Promise<string> {
    const rawTxn = await this.generateTransaction(coinReceiver.address(), {
      function: "0x1::managed_coin::register",
      type_arguments: [`${address.hex()}::toast_coin::ToastCoin`],
      arguments: [],
    });

    const signedTxn = await this.signTransaction(coinReceiver, rawTxn);

    const tx = await this.submitTransaction(signedTxn);

    return tx.hash;
  }

  async mintCoin(
    minter: AptosAccount,
    receiverAddress: HexString,
    amount: number | bigint
  ): Promise<string> {
    const rawTxn = await this.generateTransaction(minter.address(), {
      function: "0x1::managed_coin::mint",
      type_arguments: [`${minter.address()}::toast_coin::ToastCoin`],
      arguments: [receiverAddress.hex(), amount],
    });

    const bcsTxn = await this.signTransaction(minter, rawTxn);
    const pendingTxn = await this.submitTransaction(bcsTxn);

    return pendingTxn.hash;
  }

  async getBalance(
    address: MaybeHexString,
    coinTypeAddress: HexString
  ): Promise<string | number> {
    try {
      const resource = await this.getAccountResource(
        address,
        `0x1::coin::CoinStore<${coinTypeAddress.hex()}::toast_coin::ToastCoin>`
      );
      return parseInt((resource.data as any)["coin"]["value"]);
    } catch (_) {
      return 0;
    }
  }
}
