import { HardhatUserConfig } from "hardhat/config";
import "hardhat-gas-reporter"
import "@nomicfoundation/hardhat-toolbox-viem";
import 'solidity-docgen';

const config: HardhatUserConfig = {
  solidity: "0.8.20",
};

export default config;
