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
  "0x1904179e47b9de6dae4314c80efd8dc79abc0d32317a7a354bb25042d0d2cb21";
const sender = new AptosAccount(new HexString(privateKey).toUint8Array());

async function payGas() {
  const rawTxn = await client.generateTransaction(sender.address(), {
    function: `${coinTypeAddress}::axelar_gas_service::payNativeGasForContractCall`,
    type_arguments: [],
    arguments: [
      "ethereum",
      "0xa411977dd24F1547065C6630E468a43275cB4d7f",
      [0, 0, 0, 0, 1],
      10000,
      coinTypeAddress,
    ],
  });
  console.log("hello");
  const signedTxn = await client.signTransaction(sender, rawTxn);
  const pendingTxn = await client.submitTransaction(signedTxn);
  console.log("Wait for gas service transaction", pendingTxn.hash);
  const tx = await client.waitForTransactionWithResult(pendingTxn.hash);
  console.log(tx.hash);
}

(async () => {
  await payGas();
  const rawTxn = await client.generateTransaction(sender.address(), {
    function: `${coinTypeAddress}::axelar_gateway::call_contract`,
    type_arguments: [],
    arguments: [
      "ethereum",
      "0xa411977dd24F1547065C6630E468a43275cB4d7f",
      [0, 0, 0, 0, 1],
    ],
  });

  const signedTxn = await client.signTransaction(sender, rawTxn);
  const pendingTxn = await client.submitTransaction(signedTxn);
  console.log("Wait for transaction", pendingTxn.hash);
  const tx = await client.waitForTransactionWithResult(pendingTxn.hash);
  console.log(tx);
})();
