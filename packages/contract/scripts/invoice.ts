import {
  formatEther,
  parseEther,
  createPublicClient,
  http,
  createWalletClient,
  parseTransaction,
  parseUnits,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { hardhat } from "viem/chains";
import dataInvoice from "../artifacts/contracts/Invoice.sol/Invoice.json";
import data from "../address.json";
import { v4 as uuidv4 } from "uuid";
import { generateRandomHex } from "../test/generateRandomHex";
import { randomNumber } from "./randomNumber";

async function main() {
  const account = privateKeyToAccount(
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
  );

  const client = createWalletClient({
    account,
    chain: hardhat,
    transport: http(),
  });

  const publicClient = createPublicClient({
    chain: hardhat,
    transport: http(),
  });
  async function create(n: number) {
    let receivers: `0x${string}`[] = [];
    let amounts: bigint[] = [];
    for (let index = 0; index < randomNumber(100); index++) {
      receivers[index] = generateRandomHex();
      amounts[index] = parseUnits(randomNumber(10).toString(), 18);
    }

    const { request } = await publicClient.simulateContract({
      account,
      address: data.invoice as `0x${string}`,
      abi: dataInvoice.abi,
      functionName: "create",
      args: [
        true,
        uuidv4(),
        data.token,
        generateRandomHex(),
        account.address,
        receivers,
        amounts,
      ],
    });
    const result = await client.writeContract(request);
    const receipt = await publicClient.waitForTransactionReceipt({
      hash: result,
    });
    console.log(`create:${receipt.status}-${n}`);
  }
  for (let index = 0; index < 100; index++) {
    await create(index);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
