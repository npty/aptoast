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

const client = new AptosClient("http://localhost:8080");
// const modulePath = "contracts/toast_coin/build/ToastCoin";
// const compiledModule = "toast_coin.mv";
const packages = [
  {
    modulePath: "contracts/axelar-framework/build/AxelarFramework",
    compiledModules: ["axelar_gateway.mv", "axelar_gas_service.mv"],
  },
  {
    modulePath: "contracts/call_contract_tester/build/call_contract_tester",
    compiledModules: ["call_contract_tester.mv"],
  },
];
(async (packages: any[]) => {
  for (const p of packages) {
    const packageMetadata = fs.readFileSync(
      path.join(p.modulePath, "package-metadata.bcs")
    );
    const moduleDatas = p.compiledModules.map((module: string) => {
      return fs.readFileSync(
        path.join(p.modulePath, "bytecode_modules", module)
      );
    });

    const owner = new AptosAccount(new HexString(privateKey).toUint8Array());
    console.log("Publishing module...", p.modulePath);
    const txnHash = await client.publishPackage(
      owner,
      new HexString(packageMetadata.toString("hex")).toUint8Array(),
      moduleDatas.map(
        (moduleData: any) =>
          new TxnBuilderTypes.Module(
            new HexString(moduleData.toString("hex")).toUint8Array()
          )
      )
    );
    await client.waitForTransaction(txnHash, { checkSuccess: true });
    console.log("Published module:", txnHash);
  }
})(packages);
