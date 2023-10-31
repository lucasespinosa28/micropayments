import {
  createPublicClient,
  http,
  createWalletClient,
  parseUnits,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { hardhat } from "viem/chains";
import dataInvoice from "../artifacts/contracts/Invoice.sol/Invoice.json";
import data from "../address.json";
import { v4 as uuidv4 } from "uuid";
import { generateRandomHex } from "../test/generateRandomHex";
import { randomNumber } from "./randomNumber";
import { faker } from "@faker-js/faker";

const url = "http://localhost:8800/save/@id";

type Result = {
  success: boolean;
  message: Payments[] | string;
};


export type Payments = {
  address: string;
  name: string;
  notes: string;
  quantity: number;
  amount: string;
};

export type UploadData = {
  name: string;
  body: {
    token:`0x${string}`
    payments:Payments[]
  }
};

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
    let payments: Payments[] = [];
    for (let index = 0; index < randomNumber(100); index++) {
      const quantity = faker.number.int({ min: 1, max: 10 });
      const amount = faker.number.float({ min: 0.5, max: 10, precision: 0.01 });
      const hex = generateRandomHex()
      payments[index] = {
        address: hex,
        name: faker.internet.userName(),
        notes: faker.lorem.lines(1),
        quantity:quantity,
        amount: amount.toString(),
      };
      receivers[index] = hex;
      amounts[index] = parseUnits((quantity * amount).toString(), 18);
    }
    const id = uuidv4();
    const { request } = await publicClient.simulateContract({
      account,
      address: data.invoice as `0x${string}`,
      abi: dataInvoice.abi,
      functionName: "create",
      args: [
        true,
        id,
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
    console.log(`create:${receipt.status}-${n}-${id}`);
    const upload = await fetch(url.replace("@id",id), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({token:data.token as `0x${string}`,payments:payments}),
    })
    const json = await upload.json() as Result;
    console.log(`offchain-${id} ${json.success}`)
  }
  for (let index = 0; index < 100; index++) {
    await create(index);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
