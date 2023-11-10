import {
  PublicClient,
  Account
} from "viem";
import contracts from "../address.json";
import invoice from "../artifacts/contracts/Invoice.sol/Invoice.json";

export async function getHistory(publicClient: PublicClient, account: Account) {
  const history = await publicClient.readContract({
    address: contracts.invoice as `0x${string}`,
    abi: invoice.abi,
    functionName: 'getHistory',
    args: [account.address]
  }) as `0x${string}`[];
  return history;
  // for (let index = 0; index < history.length; index++) {
  //   const element = array[index];
  // }
  // const payments = history.map(async (item,index) =>{
  //   const payment = await publicClient.readContract({
  //     address:contracts.invoice as `0x${string}`,
  //     abi: invoice.abi,
  //     functionName: 'getPayments',
  //     args:[item]
  //   })
  //   const result = payment;
  //   return result
  // })
  // console.log(payments)
}
