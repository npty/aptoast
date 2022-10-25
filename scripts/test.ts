const { privateKey } = require("../secret.json");
const {
  AptosAccount,
  AptosClient,
  HexString,
  TxnBuilderTypes,
} = require("aptos");

// const client = new AptosClient("https://fullnode.testnet.aptoslabs.com/v1");
const client = new AptosClient("http://localhost:8080");
const coinTypeAddress =
  "0x8ac1b8ff9583ac8e661c7f0ee462698c57bb7fc454f587e3fa25a57f9406acc0";
const sender = new AptosAccount(new HexString(privateKey).toUint8Array());

(async () => {
  const rawTxn = await client.generateTransaction(sender.address(), {
    function: `${coinTypeAddress}::call_contract_tester::call`,
    type_arguments: [],
    arguments: [
      "ethereum",
      "0xa411977dd24F1547065C6630E468a43275cB4d7f",
      new HexString(
        "00000000000000000000000000000000000000000000000000000000000186a000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000002000000000000000000000000a411977dd24f1547065c6630e468a43275cb4d7f000000000000000000000000a411977dd24f1547065c6630e468a43275cb4d7f"
      ).toUint8Array(),
      1,
    ],
  });

  const signedTxn = await client.signTransaction(sender, rawTxn);
  const pendingTxn = await client.submitTransaction(signedTxn);
  console.log("Wait for transaction", pendingTxn.hash);
  const tx = await client.waitForTransactionWithResult(pendingTxn.hash);
  console.log(tx);
})();
