import {
  createPublicClient,
  http,
  createWalletClient,
  parseUnits,
  stringToHex,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { hardhat } from "viem/chains";
import { appendFileSync } from "fs";
import accounts from "./accounts.json";
import contracts from "../address.json";
import token from "../artifacts/contracts/Token.sol/Token.json";
import invoice from "../artifacts/contracts/Invoice.sol/Invoice.json";
import { nanoid } from "nanoid";
import { generateRandomHex } from "../test/generateRandomHex";
import { faker } from "@faker-js/faker";

async function main() {
  createLoop(5);
  //await dummycsv();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

async function dummycsv() {
  const account = privateKeyToAccount(accounts[0].PrivateKey as `0x${string}`);

  try {
    appendFileSync("./dummy.csv", `name,dateTime,payer,amount,receiver\n`);
    console.log("Data has been appended to file!");
  } catch (error) {
    console.error(error);
  }
  for (let index = 0; index < 20; index++) {
    const date = new Date();
    try {
      appendFileSync(
        "./dummy.csv",
        `${faker.person.fullName()},${date.getFullYear()}-${date.getMonth() + 1}-${date.getDay() + 1},${account.address},${faker.number.float({ min: 0.5, max: 10, precision: 0.01 })},${generateRandomHex()}\n`
      );
      console.log("Data has been appended to file!");
    } catch (error) {
      console.error(error);
    }
  }
}

function createLoop(limit: number) {
  const account = privateKeyToAccount(accounts[0].PrivateKey as `0x${string}`);
  const wallet = createWalletClient({
    account,
    chain: hardhat,
    transport: http(),
  });

  const publicClient = createPublicClient({
    chain: hardhat,
    transport: http(),
  });

  let count = 0;
  let intervalId = setInterval(
    async () => {
      count++;
      await payment0(wallet, account, publicClient);
      if (count == limit) {
        stopGreeting();
      }
      console.log(`#${count}`);
    },
    1000,
    "invoice"
  );

  function stopGreeting() {
    clearInterval(intervalId);
  }
}

async function payment0(wallet: any, account: any, publicClient: any) {
  const mint = await wallet.writeContract({
    address: contracts.token as `0x${string}`,
    abi: token.abi,
    functionName: "mint",
    args: [account.address],
  });

  const receiptMint = await publicClient.waitForTransactionReceipt({
    hash: mint,
  });
  console.log("Mint:", receiptMint.status);
  const id = stringToHex(nanoid(), { size: 32 });
  const dateTime: bigint[] = [];
  const stable: `0x${string}`[] = [];
  const amount: bigint[] = [];
  const payer: `0x${string}`[] = [];
  const receiver: `0x${string}`[] = [];

  const number = faker.number.int({ min: 3, max: 10 });
  console.log(number);
  for (let index = 0; index < number; index++) {
    const timestampSeconds = Math.floor(Date.now() / 1000);
    if (index % 2 == 1) {
      dateTime.push(BigInt(timestampSeconds));

    }else{
      dateTime.push(BigInt(timestampSeconds)+100000n);

    }
    stable.push(contracts.token as `0x${string}`);
    amount.push(parseUnits(faker.number.float({ min: 0.5, max: 10, precision: 0.01 }).toString(), 18));
    payer.push(account.address);
    //receiver.push(account.address);
    //payer.push(generateRandomHex());
    receiver.push(generateRandomHex());
  }

  const createPayment = await wallet.writeContract({
    address: contracts.invoice as `0x${string}`,
    abi: invoice.abi,
    functionName: "createPayment",
    args: [id, dateTime, stable, amount, payer, receiver],
  });

  const receiptCreatePayment = await publicClient.waitForTransactionReceipt({
    hash: createPayment,
  });
  console.log("CreatePayment:", receiptCreatePayment.status);

}

async function newPayment(wallet: any, account: any, publicClient: any) {
  const mint = await wallet.writeContract({
    address: contracts.token as `0x${string}`,
    abi: token.abi,
    functionName: "mint",
    args: [account.address],
  });

  const receiptMint = await publicClient.waitForTransactionReceipt({
    hash: mint,
  });
  console.log("Mint:", receiptMint.status);

  const approve = await wallet.writeContract({
    address: contracts.token as `0x${string}`,
    abi: token.abi,
    functionName: "approve",
    args: [contracts.invoice as `0x${string}`, parseUnits("100.0", 18)],
  });

  const receiptApprove = await publicClient.waitForTransactionReceipt({
    hash: approve,
  });
  console.log("Approve:", receiptApprove.status);

  const id = stringToHex(nanoid(), { size: 32 });
  const dateTime: bigint[] = [];
  const stable: `0x${string}`[] = [];
  const amount: bigint[] = [];
  const payer: `0x${string}`[] = [];
  const receiver: `0x${string}`[] = [];

  const number = faker.number.int({ min: 3, max: 10 });
  console.log(number);
  for (let index = 0; index < number; index++) {
    const timestampSeconds = Math.floor(Date.now() / 1000);
    dateTime.push(BigInt(timestampSeconds));
    stable.push(contracts.token as `0x${string}`);
    amount.push(parseUnits("10.0", 18));
    payer.push(account.address);
    receiver.push(generateRandomHex());
  }

  const createPayment = await wallet.writeContract({
    address: contracts.invoice as `0x${string}`,
    abi: invoice.abi,
    functionName: "createPayment",
    args: [id, dateTime, stable, amount, payer, receiver],
  });

  const receiptCreatePayment = await publicClient.waitForTransactionReceipt({
    hash: createPayment,
  });
  console.log("CreatePayment:", receiptCreatePayment.status);

  for (let index = 0; index < receiver.length; index++) {
    const sendPayment = await wallet.writeContract({
      address: contracts.invoice as `0x${string}`,
      abi: invoice.abi,
      functionName: "sendPayment",
      args: [id, BigInt(index)],
    });

    const receiptsendPayment = await publicClient.waitForTransactionReceipt({
      hash: sendPayment,
    });
    console.log(`${index} sendPayment:${receiptsendPayment.status}`);

    const confirm = await wallet.writeContract({
      address: contracts.invoice as `0x${string}`,
      abi: invoice.abi,
      functionName: "confirm",
      args: [id, BigInt(index)],
    });

    const receiptConfirm = await publicClient.waitForTransactionReceipt({
      hash: confirm,
    });
    console.log(`${index} confirm:${receiptConfirm.status}`);
  }
}
