import { formatEther, parseEther, createPublicClient, http, createWalletClient, parseTransaction } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { hardhat } from 'viem/chains'
import dataInvoice from "../artifacts/contracts/Invoice.sol/Invoice.json"
import dataToken from "../artifacts/contracts/Token.sol/Token.json"
import { writeFileSync } from "fs";
import accounts from "./accounts.json";
async function main() {
  const account = privateKeyToAccount(accounts[0].PrivateKey as `0x${string}`)

  const wallet = createWalletClient({
    account,
    chain: hardhat,
    transport: http()
  })

  const publicClient = createPublicClient({
    chain: hardhat,
    transport: http()
  })
  console.log({
    abi: dataInvoice.abi,
    account,
    bytecode: dataInvoice.bytecode as `0x${string}`,
    args: [accounts[0].Account as `0x${string}`]
  })
  const invoice = await wallet.deployContract({
    abi: dataInvoice.abi,
    account,
    bytecode: dataInvoice.bytecode as `0x${string}`,
    args: [accounts[0].Account as `0x${string}`]
  })

  console.log(`contract was deployed successfully address: ${JSON.stringify(invoice)}`);
  const invoiceReceipt = await publicClient.waitForTransactionReceipt({ hash: invoice })
  const invoiceAddress = invoiceReceipt.contractAddress;

  const Token = await wallet.deployContract({
    abi: dataToken.abi,
    account,
    bytecode: dataToken.bytecode as `0x${string}`
  })

  console.log(`contract was deployed successfully address: ${JSON.stringify(Token)}`);
  const TokenReceipt = await publicClient.waitForTransactionReceipt({ hash: Token })
  const TokenAddress = TokenReceipt.contractAddress;

  const mint = await wallet.writeContract({
    address: TokenAddress as `0x${string}`,
    abi: dataToken.abi,
    functionName: "mint",
    args: [account.address],
  });

  const receiptMint = await publicClient.waitForTransactionReceipt({
    hash: mint,
  });
  console.log("Mint:", receiptMint.status);
  writeFileSync('address.json', JSON.stringify({ invoice: invoiceAddress, token: TokenAddress }), { encoding: 'utf8', flag: 'w' });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
