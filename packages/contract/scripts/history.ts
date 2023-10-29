import { formatEther, parseEther, createPublicClient, http, createWalletClient, parseTransaction, parseUnits } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { hardhat } from 'viem/chains'
import dataInvoice from "../artifacts/contracts/Invoice.sol/Invoice.json"
import data from "../address.json"
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
  //const resulPayments = await invoice.read.getPayments([resulthistory[0]]);
  const history = await publicClient.readContract({
    address:data.invoice as `0x${string}`,
    abi: dataInvoice.abi,
    functionName: 'getHistory',
    args:[account.address]
  }) as string[]
  console.log(history)
  history.map(async (item,index) =>{
    const payment = await publicClient.readContract({
      address:data.invoice as `0x${string}`,
      abi: dataInvoice.abi,
      functionName: 'getPayments',
      args:[item]
    })
    console.log(payment)
    //console.log(JSON.stringify({id:item,data:payment}))
  })
  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
