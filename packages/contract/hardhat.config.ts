import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-chai-matchers";
import "hardhat-gas-reporter"
import "@nomicfoundation/hardhat-toolbox-viem";
import 'solidity-docgen';
import 'solidity-coverage'
import '@openzeppelin/hardhat-upgrades';
import 'dotenv/config'


const privateKey =() => {
  if(process.env.PRIVATEKEY){
    return process.env.PRIVATEKEY
  }
  return "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
}

const config: HardhatUserConfig = {
  defaultNetwork: "localhost",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      accounts:["0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"]
    },
    alfajor: {
      url: "https://alfajores-forno.celo-testnet.org",
      accounts: [privateKey()]
    },
    celo: {
      url: "https://forno.celo.org",
      accounts: [privateKey()]
    },
  },
  solidity: "0.8.20",
};

export default config;
