const { privateKey } = require("../secret.json");
const {
  AptosAccount,
  AptosClient,
  HexString,
  TxnBuilderTypes,
} = require("aptos");

const client = new AptosClient("https://fullnode.testnet.aptoslabs.com/v1");
const coinTypeAddress =
  "0xfb4a696ff785a56b76a80872898829da8d8b17755b17d161f35733a45182ef10";
const sender = new AptosAccount(new HexString(privateKey).toUint8Array());

async function payGas() {
  const rawTxn = await client.generateTransaction(sender.address(), {
    function: `${coinTypeAddress}::axelar_gas_service_v2::payNativeGasForContractCall`,
    type_arguments: [],
    arguments: [
      "moonbeam",
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
      "moonbeam",
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
