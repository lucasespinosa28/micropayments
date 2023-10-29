import { formatEther, parseEther, createPublicClient, http, createWalletClient, parseTransaction } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { hardhat } from 'viem/chains'
import dataInvoice from "../artifacts/contracts/Invoice.sol/Invoice.json"
import dataToken from "../artifacts/contracts/Token.sol/Token.json"
import { writeFileSync } from "fs";

async function main() {
  const account = privateKeyToAccount('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80')

  const client = createWalletClient({
    account,
    chain: hardhat,
    transport: http()
  })

  const publicClient = createPublicClient({
    chain: hardhat,
    transport: http()
  })

  const invoice = await client.deployContract({
    abi: dataInvoice.abi,
    account,
    bytecode: dataInvoice.bytecode as `0x${string}`
  })

  console.log(`contract was deployed successfully address: ${JSON.stringify(invoice)}`);
  const invoiceReceipt = await publicClient.waitForTransactionReceipt({ hash: invoice })
  const invoiceAddress = invoiceReceipt.contractAddress;

  const Token = await client.deployContract({
    abi: dataToken.abi,
    account,
    bytecode: dataToken.bytecode as `0x${string}`
  })

  console.log(`contract was deployed successfully address: ${JSON.stringify(Token)}`);
  const TokenReceipt = await publicClient.waitForTransactionReceipt({ hash: Token })
  const TokenAddress = TokenReceipt.contractAddress;
  writeFileSync('address.json', JSON.stringify({invoice:invoiceAddress,token:TokenAddress}),{encoding:'utf8',flag:'w'});
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});