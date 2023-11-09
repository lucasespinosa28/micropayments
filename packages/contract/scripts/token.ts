import { formatEther, parseEther, createPublicClient, http, createWalletClient, parseTransaction, parseUnits } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { hardhat } from 'viem/chains'
import dataToken from "../artifacts/contracts/Token.sol/Token.json"
import data from "../address.json"

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
  async function mint(){
    const { request } = await publicClient.simulateContract({
      account,
      address:data.token as `0x${string}`,
      abi: dataToken.abi,
      functionName: 'mint',
      args:[account.address]
    })
    const result = await client.writeContract(request)
    const receipt = await publicClient.waitForTransactionReceipt({ hash: result })
    console.log(`mint:${receipt.status}`)
  }
  await mint()

  async function appove(){
    const { request } = await publicClient.simulateContract({
      account,
      address:data.token as `0x${string}`,
      abi: dataToken.abi,
      functionName: 'approve',
      args:[data.invoice as `0x${string}`,parseUnits("1000000000000000000000000", 18)]
    })
    const result = await client.writeContract(request)
    const receipt = await publicClient.waitForTransactionReceipt({ hash: result })
    console.log(`approve:${receipt.status}`)
  }

  const balance = await publicClient.readContract({
    address:data.token as `0x${string}`,
    abi: dataToken.abi,
    functionName: 'balanceOf',
    args:[account.address]
  })
  console.log(`balanceOf: ${balance}`)
  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
