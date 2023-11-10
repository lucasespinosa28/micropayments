import {
  createPublicClient,
  http,
  createWalletClient,
  parseUnits,
  PublicClient,
  Account,
  stringToHex,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { hardhat } from "viem/chains";

import accounts from "./accounts.json";
import contracts from "../address.json"
import token from "../artifacts/contracts/Token.sol/Token.json"
import invoice from "../artifacts/contracts/Invoice.sol/Invoice.json"
import { nanoid } from "nanoid";
import { getHistory } from "./getHistory";
import { getPayments } from "./getPayments";
import { Payment } from "./Payment";



// address: string;
// name: string;
// notes: string;
// quantity: number;
// amount: string;

function client(account: Account) {
  return createWalletClient({
    account,
    chain: hardhat,
    transport: http(),
  });
}

async function initialize(index: number) {
  const account = privateKeyToAccount(accounts[index].PrivateKey as `0x${string}`);

  const publicClient = createPublicClient({
    chain: hardhat,
    transport: http(),
  });
  return { publicClient, account }
}

async function mint(publicClient: PublicClient, account: Account) {
  const { request } = await publicClient.simulateContract({
    account,
    address: contracts.token as `0x${string}`,
    abi: token.abi,
    functionName: 'mint',
    args: [account.address]
  })
  const result = await client(account).writeContract(request)
  const receipt = await publicClient.waitForTransactionReceipt({ hash: result })
  setTimeout(() => {
    console.log(`mint:${receipt.status}`)
  }, 1000);

}

async function appove(publicClient: PublicClient, account: Account) {
  const { request } = await publicClient.simulateContract({
    account,
    address: contracts.token as `0x${string}`,
    abi: token.abi,
    functionName: 'approve',
    args: [contracts.invoice as `0x${string}`, parseUnits("1000", 18)]
  })
  const result = await client(account).writeContract(request)
  const receipt = await publicClient.waitForTransactionReceipt({ hash: result })
  setTimeout(() => {
    console.log(`approve:${receipt.status}`)
  }, 1000);

}

async function createPayment(publicClient: PublicClient, account: Account, accounts: `0x${string}`[]) {
  const id = stringToHex(nanoid(), { size: 32 });
  const dateTime: bigint[] = [];
  const stable: `0x${string}`[] = [];
  const amount: bigint[] = [];
  const payer: `0x${string}`[] = [];
  const receiver: `0x${string}`[] = [];

  for (let index = 1; index < 11; index++) {
    const timestampSeconds = Math.floor(Date.now() / 1000);
    dateTime.push(BigInt(timestampSeconds));
    stable.push(contracts.token as `0x${string}`);
    amount.push(parseUnits("10", 18));
    payer.push(account.address);
    receiver.push(accounts[index]);
  }

  const { request } = await publicClient.simulateContract({
    account,
    address: contracts.invoice as `0x${string}`,
    abi: invoice.abi,
    functionName: 'createPayment',
    args: [id,
      dateTime,
      stable,
      amount,
      payer,
      receiver,]
  })
  const result = await client(account).writeContract(request)
  const receipt = await publicClient.waitForTransactionReceipt({ hash: result })
  setTimeout(() => {
    console.log(`createPayment:${receipt.status}`)
  }, 1000);

  return { id: id, length: receiver.length }
}

async function confirm(id: `0x${string}`, index: number, publicClient: PublicClient, account: Account) {
  const { request } = await publicClient.simulateContract({
    account: account,
    address: contracts.invoice as `0x${string}`,
    abi: invoice.abi,
    functionName: "confirm",
    args: [id, BigInt(index)],
  });
  const result = await client(account).writeContract(request)
  const receipt = await publicClient.waitForTransactionReceipt({ hash: result })
  setTimeout(() => {
    console.log(`confirm:${receipt.status}`)
  }, 1000);

}

async function cancel(id: `0x${string}`, index: number, publicClient: PublicClient, account: Account) {
  const { request } = await publicClient.simulateContract({
    account: account,
    address: contracts.invoice as `0x${string}`,
    abi: invoice.abi,
    functionName: "confirm",
    args: [id, BigInt(index)],
  });
  const result = await client(account).writeContract(request)
  const receipt = await publicClient.waitForTransactionReceipt({ hash: result })
  setTimeout(() => {
    console.log(`confirm:${receipt.status}`)
  }, 1000);

}

async function sendPayment(id: `0x${string}`, index: bigint, publicClient: PublicClient, account: Account) {
  const { request } = await publicClient.simulateContract({
    account: account,
    address: contracts.invoice as `0x${string}`,
    abi: invoice.abi,
    functionName: "sendPayment",
    args: [id, index],
  });
  const result = await client(account).writeContract(request)
  const receipt = await publicClient.waitForTransactionReceipt({ hash: result })
  setTimeout(() => {
    console.log(`sendPayment:${receipt.status} id:${index}`)
  }, 1000)
}

async function main() {
  for (let index = 0; index < 5; index++) {
    console.log(`#${index}`)
    await createInvoice0();
  }
  // const responses =  
  // for(let response of responses) {
  //   console.log(response)
  // }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
async function createInvoice0() {
  const { publicClient, account } = await initialize(0);
  const owner = account;
  await mint(publicClient, account);
  await appove(publicClient, account);
  const address = accounts.map(acc => acc.Account as `0x${string}`);
  const { id, length } = await createPayment(publicClient, account, address);
  // for (let index = 0; index < length; index++) {
  //   const { account } = await initialize(index + 1);
  //   await sendPayment(id, BigInt(index), publicClient, owner);
  //   await confirm(id, index, publicClient, account);

  // }
}
async function createInvoice2() {
  const { publicClient, account } = await initialize(0);
  const owner = account;
  await mint(publicClient, account);
  await appove(publicClient, account);
  const address = accounts.map(acc => acc.Account as `0x${string}`);
  const { id, length } = await createPayment(publicClient, account, address);
  for (let index = 0; index < length; index++) {
    const { account } = await initialize(index + 1);
    await sendPayment(id, BigInt(index), publicClient, owner);
    await confirm(id, index, publicClient, account);

  }
}
// async function invoice() {
//   const account = privateKeyToAccount(
//     "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
//   );


//   async function create(n: number) {
//     let receivers: `0x${string}`[] = [];
//     let amounts: bigint[] = [];
//     let payments: Payments[] = [];
//     for (let index = 0; index < randomNumber(100); index++) {
//       const quantity = faker.number.int({ min: 1, max: 10 });
//       const amount = faker.number.float({ min: 0.5, max: 10, precision: 0.01 });
//       const hex = generateRandomHex();
//       payments[index] = {
//         address: hex,
//         name: faker.internet.userName(),
//         notes: faker.lorem.lines(1),
//         quantity: quantity,
//         amount: amount.toString(),
//       };
//       receivers[index] = hex;
//       amounts[index] = parseUnits((quantity * amount).toString(), 18);
//     }
//     const id = uuidv4();
//     const { request } = await publicClient.simulateContract({
//       account,
//       address: data.invoice as `0x${string}`,
//       abi: dataInvoice.abi,
//       functionName: "create",
//       args: [
//         true,
//         id,
//         data.token,
//         receivers,
//         amounts,
//       ],
//     });
//     const result = await client.writeContract(request);
//     const receipt = await publicClient.waitForTransactionReceipt({
//       hash: result,
//     });
//     console.log(`create:${receipt.status}-${n}-${id}`);
//     const upload = await fetch(url.replace("@id", id), {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ token: data.token as `0x${string}`, payments: payments }),
//     });
//     const json = await upload.json() as Result;
//     console.log(`offchain-${id} ${json.success}`);
//   }
//   for (let index = 0; index < 28; index++) {
//     await create(index);
//   }
// }

