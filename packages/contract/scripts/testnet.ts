import { ethers, upgrades } from "hardhat";
import { writeFileSync } from "fs";


async function main() {
  // Deploying
  const paymentsFactory = await ethers.getContractFactory("Invoice");
  const Payments = await upgrades.deployProxy(paymentsFactory);
  await Payments.waitForDeployment();
  console.log("contract deploymented successfully");
  let address = await Payments.getAddress();
  writeFileSync('testnet.json', JSON.stringify({ address: address}), { encoding: 'utf8', flag: 'w' });
}

main();