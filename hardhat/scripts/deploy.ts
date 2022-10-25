import { ethers } from "hardhat";
import { config } from "./config";

async function main() {
  const HelloWorld = await ethers.getContractFactory("HelloWorld");
  const helloWorld = await HelloWorld.deploy(
    config.gateway,
    config.gasReceiver
  );

  await helloWorld.deployed();

  console.log("HelloWorld deployed to:", helloWorld.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
