// Publish Toast token
const {
  AptosAccount,
  AptosClient,
  HexString,
  TxnBuilderTypes,
} = require("aptos");
const fs = require("fs");
const path = require("path");
const { privateKey } = require("../secret.json");

const client = new AptosClient("https://fullnode.testnet.aptoslabs.com/v1");
// const modulePath = "contracts/toast_coin/build/ToastCoin";
// const compiledModule = "toast_coin.mv";
const modulePath = "contracts/axelar_gas_service/build/axelar_gas_service";
const compiledModule = "axelar_gas_service.mv";

(async () => {
  const packageMetadata = fs.readFileSync(
    path.join(modulePath, "package-metadata.bcs")
  );
  const moduleData = fs.readFileSync(
    path.join(modulePath, "bytecode_modules", compiledModule)
  );

  const owner = new AptosAccount(new HexString(privateKey).toUint8Array());
  console.log("Publishing module...");
  const txnHash = await client.publishPackage(
    owner,
    new HexString(packageMetadata.toString("hex")).toUint8Array(),
    [
      new TxnBuilderTypes.Module(
        new HexString(moduleData.toString("hex")).toUint8Array()
      ),
    ]
  );
  await client.waitForTransaction(txnHash, { checkSuccess: true });
  console.log("Published module:", txnHash);
})();
