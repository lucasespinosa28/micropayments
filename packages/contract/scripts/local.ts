import { ethers, upgrades } from "hardhat";
import { writeFileSync } from "fs";


async function main() {
  // Deploying
  const paymentsFactory = await ethers.getContractFactory("Invoice");
  const Payments = await upgrades.deployProxy(paymentsFactory);
  await Payments.waitForDeployment();
  let address = await Payments.getAddress();
  console.log("contract payment deploymented successfully",address);


  const tokemFactory = await ethers.getContractFactory("Token");
  const token = await upgrades.deployProxy(tokemFactory);
  await token.waitForDeployment();
  let tokenAddress = await token.getAddress();

  console.log("contract token deploymented successfully",tokenAddress);
  writeFileSync('local.json', JSON.stringify({ payments: address,token:tokenAddress}), { encoding: 'utf8', flag: 'w' });
}

main();