import { createPublicClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { hardhat } from 'viem/chains'
import { getHistory } from "./getHistory";
import { getPayments } from "./getPayments";
import { Payment } from "./Payment";


async function main() {
  const account = privateKeyToAccount('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80')
  const publicClient = createPublicClient({
    chain: hardhat,
    transport: http()
  })
  const history = await getHistory(publicClient, account);
  for (let index = 0; index < history.length; index++) {
    const payments = await getPayments(publicClient, history[index]) as Payment[]
    console.log(payments)
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
