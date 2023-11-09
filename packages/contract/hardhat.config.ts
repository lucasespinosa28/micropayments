import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-chai-matchers";
import "hardhat-gas-reporter"
import "@nomicfoundation/hardhat-toolbox-viem";
import 'solidity-docgen';
import 'solidity-coverage'

const config: HardhatUserConfig = {
  solidity: "0.8.20",
};

export default config;
