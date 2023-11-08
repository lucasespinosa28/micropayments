import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
//import { v4 as uuidv4 } from "uuid";
/** @file: index.ts **/
import { nanoid } from "nanoid";
import { parseUnits, stringToHex } from "viem";
import { generateRandomHex } from "./generateRandomHex";
import { assert } from "console";

describe("Invoice", function () {
  async function deployFixture() {
    const [owner, otherAccount] = await hre.viem.getWalletClients();
    const invoice = await hre.viem.deployContract("Invoice", [
      owner.account.address,
    ]);
    const token = await hre.viem.deployContract("Token");
    const publicClient = await hre.viem.getPublicClient();

    return {
      invoice,
      token,
      owner,
      otherAccount,
      publicClient,
    };
  }

  it("blocked", async () => {
    const { invoice, owner } = await loadFixture(deployFixture);
    await invoice.write.setBlock([true]);
    const result = await invoice.read.isBlocked([owner.account.address]);
    expect(result).equal(true);
  });
  it("create banned list", async () => {
    const { invoice, owner } = await loadFixture(deployFixture);
    const accounts: `0x${string}`[] = [];
    for (let index = 0; index < 5; index++) {
      accounts.push(generateRandomHex());
    }
    await invoice.write.updateBanned([accounts]);
    const result = await invoice.read.getBannedList([owner.account.address]);
    expect(JSON.stringify(result.map((item) => item.toLowerCase()))).equal(
      JSON.stringify(accounts.map((item) => item.toLowerCase()))
    );
  });
  it("update banned list", async () => {
    const { invoice, owner } = await loadFixture(deployFixture);
    const oldAccounts: `0x${string}`[] = [];
    const newAccounts: `0x${string}`[] = [];
    for (let index = 0; index < 5; index++) {
      oldAccounts.push(generateRandomHex());
      newAccounts.push(generateRandomHex());
    }
    await invoice.write.updateBanned([oldAccounts]);
    await invoice.write.updateBanned([newAccounts]);

    const result = await invoice.read.getBannedList([owner.account.address]);
    expect(JSON.stringify(result.map((item) => item.toLowerCase()))).not.equal(
      JSON.stringify(oldAccounts.map((item) => item.toLowerCase()))
    );
  });
  it("create payment", async () => {
    const { invoice, owner, token } = await loadFixture(deployFixture);
    const id = stringToHex(nanoid(), { size: 32 });
    const dateTime: bigint[] = [];
    const stable: `0x${string}`[] = [];
    const amount: bigint[] = [];
    const payer: `0x${string}`[] = [];
    const receiver: `0x${string}`[] = [];

    for (let index = 0; index < 10; index++) {
      const timestampSeconds = Math.floor(Date.now() / 1000);
      dateTime.push(BigInt(timestampSeconds));
      stable.push(token.address);
      amount.push(parseUnits("10.0", 18));
      payer.push(owner.account.address);
      receiver.push(generateRandomHex());
    }

    await invoice.write.createPayment([
      id,
      dateTime,
      stable,
      amount,
      payer,
      receiver,
    ]);

    const result = await invoice.read.getHistory([owner.account.address]);
    const payments = await invoice.read.getPayment([result[0]]);

    for (let index = 0; index < payments.length; index++) {
      const onChain = {
        ...payments[index],
        token: payments[index].token.toLowerCase(),
        payer: payments[index].payer.toLowerCase(),
        receiver: payments[index].receiver.toLowerCase(),
      };
      const offChain = {
        dateTime: dateTime[index],
        token: stable[index].toLowerCase(),
        amount: amount[index],
        payer: payer[index].toLowerCase(),
        receiver: receiver[index].toLowerCase(),
        paid: false,
      };
      expect(onChain).deep.equal(offChain);
    }
  });
  it("send payment loop only test", async () => {
    const { invoice, owner, token } = await loadFixture(deployFixture);

    await token.write.mint([owner.account.address]);
    const oldbalance = await token.read.balanceOf([owner.account.address]);
    await token.write.approve([invoice.address, parseUnits("100.0", 18)])

    const id = stringToHex(nanoid(), { size: 32 });
    const dateTime: bigint[] = [];
    const stable: `0x${string}`[] = [];
    const amount: bigint[] = [];
    const payer: `0x${string}`[] = [];
    const receiver: `0x${string}`[] = [];

    for (let index = 0; index < 10; index++) {
      const timestampSeconds = Math.floor(Date.now() / 1000);
      dateTime.push(BigInt(timestampSeconds));
      stable.push(token.address);
      amount.push(parseUnits("10.0", 18));
      payer.push(owner.account.address);
      receiver.push(generateRandomHex());
    }

    await invoice.write.createPayment([
      id,
      dateTime,
      stable,
      amount,
      payer,
      receiver,
    ]);

    const result = await invoice.read.getHistory([owner.account.address]);
    const payments = await invoice.read.getPayment([result[0]]);
    for (let index = 0; index < payments.length; index++) {
      await invoice.write.sendPayment([result[0], BigInt(index)]);
      const receiverBalance = await token.read.balanceOf([payments[index].receiver]);
      expect(receiverBalance).equal(0n);
      const contractBalance = await token.read.balanceOf([invoice.address]);
      expect(contractBalance).not.equal(0n);
    }
    const newbalance = await token.read.balanceOf([owner.account.address]);
    expect(oldbalance).not.equal(newbalance);
  });
  it("send all payment", async () => {
    const { invoice, owner, token } = await loadFixture(deployFixture);

    await token.write.mint([owner.account.address]);
    const oldbalance = await token.read.balanceOf([owner.account.address]);
    await token.write.approve([invoice.address, parseUnits("100.0", 18)])

    const id = stringToHex(nanoid(), { size: 32 });
    const dateTime: bigint[] = [];
    const stable: `0x${string}`[] = [];
    const amount: bigint[] = [];
    const payer: `0x${string}`[] = [];
    const receiver: `0x${string}`[] = [];
    const indexes: bigint[] = [];
    for (let index = 0; index < 10; index++) {
      const timestampSeconds = Math.floor(Date.now() / 1000);
      dateTime.push(BigInt(timestampSeconds));
      stable.push(token.address);
      amount.push(parseUnits("10.0", 18));
      payer.push(owner.account.address);
      receiver.push(generateRandomHex());
      indexes.push(BigInt(index))
    }

    await invoice.write.createPayment([
      id,
      dateTime,
      stable,
      amount,
      payer,
      receiver,
    ]);

    const result = await invoice.read.getHistory([owner.account.address]);
    await invoice.write.sendAllPayment([result[0], indexes]);
    const newbalance = await token.read.balanceOf([owner.account.address]);
    expect(oldbalance).not.equal(newbalance);

    const contractBalance = await token.read.balanceOf([invoice.address]);
    expect(contractBalance).not.equal(0n);
  });
  it("send unique payment", async () => {
    const { invoice, owner, token } = await loadFixture(deployFixture);

    await token.write.mint([owner.account.address]);
    const oldbalance = await token.read.balanceOf([owner.account.address]);
    await token.write.approve([invoice.address, parseUnits("100.0", 18)])

    const id = stringToHex(nanoid(), { size: 32 });
    const dateTime: bigint[] = [];
    const stable: `0x${string}`[] = [];
    const amount: bigint[] = [];
    const payer: `0x${string}`[] = [];
    const receiver: `0x${string}`[] = [];

    for (let index = 0; index < 10; index++) {
      const timestampSeconds = Math.floor(Date.now() / 1000);
      dateTime.push(BigInt(timestampSeconds));
      stable.push(token.address);
      amount.push(parseUnits("10.0", 18));
      payer.push(owner.account.address);
      receiver.push(generateRandomHex());
    }

    await invoice.write.createPayment([
      id,
      dateTime,
      stable,
      amount,
      payer,
      receiver,
    ]);

    const result = await invoice.read.getHistory([owner.account.address]);
    await invoice.write.sendPayment([result[0], BigInt(0)]);

    const contractBalance = await token.read.balanceOf([invoice.address]);
    expect(contractBalance).equal(parseUnits("10.0", 18));

    const newbalance = await token.read.balanceOf([owner.account.address]);
    expect(oldbalance).not.equal(newbalance);
  });
  it("send all payment", async () => {
    const { invoice, owner, token } = await loadFixture(deployFixture);

    await token.write.mint([owner.account.address]);
    const oldbalance = await token.read.balanceOf([owner.account.address]);
    await token.write.approve([invoice.address, parseUnits("100.0", 18)])

    const id = stringToHex(nanoid(), { size: 32 });
    const dateTime: bigint[] = [];
    const stable: `0x${string}`[] = [];
    const amount: bigint[] = [];
    const payer: `0x${string}`[] = [];
    const receiver: `0x${string}`[] = [];
    const indexes: bigint[] = [];
    for (let index = 0; index < 10; index++) {
      const timestampSeconds = Math.floor(Date.now() / 1000);
      dateTime.push(BigInt(timestampSeconds));
      stable.push(token.address);
      amount.push(parseUnits("10.0", 18));
      payer.push(owner.account.address);
      receiver.push(generateRandomHex());
      indexes.push(BigInt(index))
    }

    await invoice.write.createPayment([
      id,
      dateTime,
      stable,
      amount,
      payer,
      receiver,
    ]);

    const result = await invoice.read.getHistory([owner.account.address]);
    await invoice.write.sendAllPayment([result[0], indexes]);
    const newbalance = await token.read.balanceOf([owner.account.address]);
    expect(oldbalance).not.equal(newbalance);

    const contractBalance = await token.read.balanceOf([invoice.address]);
    expect(contractBalance).not.equal(0n);
  });
  it("send payment and cancel with loop only test", async () => {
    const { invoice, owner, token } = await loadFixture(deployFixture);

    await token.write.mint([owner.account.address]);
    const oldbalance = await token.read.balanceOf([owner.account.address]);
    await token.write.approve([invoice.address, parseUnits("100.0", 18)])

    const id = stringToHex(nanoid(), { size: 32 });
    const dateTime: bigint[] = [];
    const stable: `0x${string}`[] = [];
    const amount: bigint[] = [];
    const payer: `0x${string}`[] = [];
    const receiver: `0x${string}`[] = [];

    for (let index = 0; index < 10; index++) {
      const timestampSeconds = Math.floor(Date.now() / 1000);
      dateTime.push(BigInt(timestampSeconds));
      stable.push(token.address);
      amount.push(parseUnits("10.0", 18));
      payer.push(owner.account.address);
      receiver.push(generateRandomHex());
    }

    await invoice.write.createPayment([
      id,
      dateTime,
      stable,
      amount,
      payer,
      receiver,
    ]);

    const result = await invoice.read.getHistory([owner.account.address]);
    const payments = await invoice.read.getPayment([result[0]]);
    let balance = await token.read.balanceOf([invoice.address]);
    expect(balance.toString()).equal("0");
    for (let index = 0; index < payments.length; index++) {
      await invoice.write.sendPayment([result[0], BigInt(index)]);
      balance = await token.read.balanceOf([invoice.address]);
      expect(balance.toString()).not.equal("0");
      await invoice.write.cancel([result[0], BigInt(index)]);
      balance = await token.read.balanceOf([invoice.address]);
      expect(balance.toString()).equal("0");
    }
    const newbalance = await token.read.balanceOf([owner.account.address]);
    expect(oldbalance.toString()).equal(newbalance.toString());
  });
  it("send unique payment and cancel", async () => {
    const { invoice, owner, token } = await loadFixture(deployFixture);

    await token.write.mint([owner.account.address]);
    const oldbalance = await token.read.balanceOf([owner.account.address]);
    await token.write.approve([invoice.address, parseUnits("100.0", 18)])

    const id = stringToHex(nanoid(), { size: 32 });
    const dateTime: bigint[] = [];
    const stable: `0x${string}`[] = [];
    const amount: bigint[] = [];
    const payer: `0x${string}`[] = [];
    const receiver: `0x${string}`[] = [];

    for (let index = 0; index < 10; index++) {
      const timestampSeconds = Math.floor(Date.now() / 1000);
      dateTime.push(BigInt(timestampSeconds));
      stable.push(token.address);
      amount.push(parseUnits("10.0", 18));
      payer.push(owner.account.address);
      receiver.push(generateRandomHex());
    }

    await invoice.write.createPayment([
      id,
      dateTime,
      stable,
      amount,
      payer,
      receiver,
    ]);

    const result = await invoice.read.getHistory([owner.account.address]);
    await invoice.write.sendPayment([result[0], BigInt(0)]);

    let payments = await invoice.read.getPayment([result[0]]);

    let contractBalance = await token.read.balanceOf([invoice.address]);
    expect(contractBalance).equal(parseUnits("10.0", 18));
    await invoice.write.cancel([result[0], BigInt(0)]);

    contractBalance = await token.read.balanceOf([invoice.address]);
    expect(contractBalance).equal(parseUnits("0", 18));

    payments = await invoice.read.getPayment([result[0]]);
    expect(payments[0].token).equal("0x0000000000000000000000000000000000000000");
  });
  it("send unique payment and confirm", async () => {
    const { invoice, owner, otherAccount, token,publicClient } = await loadFixture(deployFixture);

    await token.write.mint([owner.account.address]);
    await token.write.approve([invoice.address, parseUnits("100.0", 18)])

    const id = stringToHex(nanoid(), { size: 32 });
    const dateTime: bigint[] = [];
    const stable: `0x${string}`[] = [];
    const amount: bigint[] = [];
    const payer: `0x${string}`[] = [];
    const receiver: `0x${string}`[] = [];

    const timestampSeconds = Math.floor(Date.now() / 1000);
    dateTime.push(BigInt(timestampSeconds));
    stable.push(token.address);
    amount.push(parseUnits("10.0", 18));
    payer.push(owner.account.address);
    receiver.push(otherAccount.account.address);

    await invoice.write.createPayment([
      id,
      dateTime,
      stable,
      amount,
      payer,
      receiver,
    ]);

    const result = await invoice.read.getHistory([owner.account.address]);
    await invoice.write.sendPayment([result[0], BigInt(0)]);

    const { request } = await publicClient.simulateContract({
      account:otherAccount.account,
      address: invoice.address,
      abi: invoice.abi,
      functionName: 'confirm',
      args:[result[0], BigInt(0)],
    })
   
    let ownerAccountBalance = await token.read.balanceOf([otherAccount.account.address]);
    expect(ownerAccountBalance).equal(parseUnits("0", 18))
    
    await otherAccount.writeContract(request);
    
    ownerAccountBalance = await token.read.balanceOf([otherAccount.account.address]);
    expect(ownerAccountBalance).equal(parseUnits("10.0", 18))
    
    
    // const otherAccountBalance = await token.read.balanceOf([otherAccount.account.address]);
    // console.log(otherAccountBalance);
    // ownerAccountBalance = await token.read.balanceOf([otherAccount.account.address]);
    // console.log(ownerAccountBalance)

    // const newbalance = await token.read.balanceOf([owner.account.address]);
    // console.log(newbalance)
    // let payments = await invoice.read.getPayment([result[0]]);

    // let contractBalance = await token.read.balanceOf([invoice.address]);
    // expect(contractBalance).equal(parseUnits("10.0", 18));
    // await invoice.write.cancel([result[0], BigInt(0)]);

    // contractBalance = await token.read.balanceOf([invoice.address]);
    // expect(contractBalance).equal(parseUnits("0", 18));

    // payments = await invoice.read.getPayment([result[0]]);
    // expect(payments[0].token).equal("0x0000000000000000000000000000000000000000");
  });
  // it("time", async () => {
  //   const { invoice } = await loadFixture(deployFixture);
  //   const result = await invoice.read.getBlockTime();
  //   const timestampSeconds = Math.floor(Date.now() / 1000);
  //   expect(result.toString()).equal(timestampSeconds);
  //   //1699443290
  //   //16994433717
  //   //1699443294071

  //   //1699443433
  //   //1699443433
  // })
  // it("create payment", async () => {
  //   const { invoice, owner } = await loadFixture(deployFixture);
  //   const id = stringToHex(uuidv4(),{size:32})
  //   //ar bytes32Value = web3.utils.asciiToHex(uuidv4());v
  //   await invoice.write.createPayment([id]);
  // });
  // it("Should create a new invoice", async function () {
  //   const { invoice, token, owner, otherAccount } = await loadFixture(
  //     deployFixture
  //   );
  //   await token.write.mint([owner.account.address]);
  //   await token.write.approve([invoice.address, parseUnits("100", 18)]);
  //   const id = uuidv4();
  //   const receivers = [
  //     generateRandomHex(),
  //     generateRandomHex(),
  //     generateRandomHex(),
  //   ];
  //   const amounts = [
  //     parseUnits("1", 18),
  //     parseUnits("1", 18),
  //     parseUnits("1", 18),
  //   ];
  //   await invoice.write.create([
  //     true,
  //     id,
  //     token.address,
  //     receivers,
  //     amounts,
  //   ]);
  //   const resulthistory = await invoice.read.getHistory([
  //     owner.account.address,
  //   ]);
  //   expect(resulthistory[0]).equal(id);
  //   const resulPayments = await invoice.read.getPayments([resulthistory[0]]);
  //   for (let index = 0; index < resulPayments.length; index++) {
  //     expect(resulPayments[index].receiver.toLowerCase()).equal(
  //       receivers[index].toLowerCase()
  //     );
  //     expect(resulPayments[index].amount).equal(amounts[index]);
  //   }

  //   const resultInvoice = await invoice.read.getInvoice([resulthistory[0]]);
  //   expect(
  //     JSON.stringify({
  //       token: resultInvoice.token.toLowerCase(),
  //       payments: resultInvoice.payments,
  //     })
  //   ).equal(
  //     JSON.stringify({
  //       token: token.address.toLowerCase(),
  //       payments: id,
  //     })
  //   );

  //   for (let index = 0; index < receivers.length; index++) {
  //     const balance = await token.read.balanceOf([receivers[index]]);
  //     expect(balance.toString()).equal(amounts[index].toString());
  //   }
  // });
  // it("Should create a invoice with 100 payment", async function () {
  //   const { invoice, token, owner, otherAccount } = await loadFixture(
  //     deployFixture
  //   );
  //   await token.write.mint([owner.account.address]);
  //   await token.write.approve([invoice.address, parseUnits("2000", 18)]);
  //   const id = uuidv4();
  //   let receivers:`0x${string}`[] = [];
  //   let amounts:bigint[] = [];
  //   for (let index = 0; index < 100; index++) {
  //     receivers[index] = generateRandomHex();
  //     amounts[index] = parseUnits("1", 18);

  //   }
  //   await invoice.write.create([
  //     true,
  //     id,
  //     token.address,
  //     receivers,
  //     amounts,
  //   ]);
  //   const resulthistory = await invoice.read.getHistory([
  //     owner.account.address,
  //   ]);
  //   expect(resulthistory[0]).equal(id);
  //   const resulPayments = await invoice.read.getPayments([resulthistory[0]]);
  //   for (let index = 0; index < resulPayments.length; index++) {
  //     expect(resulPayments[index].receiver.toLowerCase()).equal(
  //       receivers[index].toLowerCase()
  //     );
  //     expect(resulPayments[index].amount).equal(amounts[index]);
  //   }

  //   const resultInvoice = await invoice.read.getInvoice([resulthistory[0]]);
  //   expect(
  //     JSON.stringify({
  //       token: resultInvoice.token.toLowerCase(),
  //       payments: resultInvoice.payments,
  //     })
  //   ).equal(
  //     JSON.stringify({
  //       token: token.address.toLowerCase(),
  //       payments: id,
  //     })
  //   );

  //   for (let index = 0; index < receivers.length; index++) {
  //     const balance = await token.read.balanceOf([receivers[index]]);
  //     expect(balance.toString()).equal(amounts[index].toString());
  //   }
  // });
  // it("Should create a invoice with 1000 payment", async function () {
  //   const { invoice, token, owner, otherAccount } = await loadFixture(
  //     deployFixture
  //   );
  //   await token.write.mint([owner.account.address]);
  //   await token.write.approve([invoice.address, parseUnits("2000", 18)]);
  //   const id = uuidv4();
  //   let receivers:`0x${string}`[] = [];
  //   let amounts:bigint[] = [];
  //   for (let index = 0; index < 1000; index++) {
  //     receivers[index] = generateRandomHex();
  //     amounts[index] = parseUnits("1", 18);

  //   }
  //   await invoice.write.create([
  //     false,
  //     id,
  //     token.address,
  //     receivers,
  //     amounts,
  //   ]);
  //   for (let index = 0; index < receivers.length; index++) {
  //     const balance = await token.read.balanceOf([receivers[index]]);
  //     expect(balance.toString()).equal(amounts[index].toString());
  //   }
  // });
});
