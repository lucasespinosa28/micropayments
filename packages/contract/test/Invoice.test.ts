import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
//import { v4 as uuidv4 } from "uuid";
/** @file: index.ts **/
import { nanoid } from "nanoid";
import { Account, PublicClient, parseUnits, stringToHex } from "viem";
import { generateRandomHex } from "./generateRandomHex";
import invoiceData from "../artifacts/contracts/Invoice.sol/Invoice.json";
describe("Invoice", function () {
  async function deployFixture() {
    const [owner, otherAccount, otherotherAccount] =
      await hre.viem.getWalletClients();
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
      otherotherAccount,
      publicClient,
    };
  }

  it("blocked", async () => {
    const { invoice, owner, publicClient } = await loadFixture(deployFixture);
    await blocked(true, publicClient, owner, invoice);
    const result = await invoice.read.isBlocked([owner.account.address]);
    expect(result).equal(true);
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
    const payments = await invoice.read.getPayments([result[0]]);

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
        status: 0,
      };
      expect(onChain).deep.equal(offChain);
    }
  });
  it("send payment loop only test", async () => {
    const { invoice, owner, token } = await loadFixture(deployFixture);

    await token.write.mint([owner.account.address]);
    const oldbalance = await token.read.balanceOf([owner.account.address]);
    await token.write.approve([invoice.address, parseUnits("100.0", 18)]);

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
    const payments = await invoice.read.getPayments([result[0]]);
    for (let index = 0; index < payments.length; index++) {
      await invoice.write.sendPayment([result[0], BigInt(index)]);
      const receiverBalance = await token.read.balanceOf([
        payments[index].receiver,
      ]);
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
    await token.write.approve([invoice.address, parseUnits("100.0", 18)]);

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
      indexes.push(BigInt(index));
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
    await token.write.approve([invoice.address, parseUnits("100.0", 18)]);

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
    await token.write.approve([invoice.address, parseUnits("100.0", 18)]);

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
      indexes.push(BigInt(index));
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
    await token.write.approve([invoice.address, parseUnits("100.0", 18)]);

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
    const payments = await invoice.read.getPayments([result[0]]);
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
    await token.write.approve([invoice.address, parseUnits("100.0", 18)]);

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

    let payments = await invoice.read.getPayments([result[0]]);

    let contractBalance = await token.read.balanceOf([invoice.address]);
    expect(contractBalance).equal(parseUnits("10.0", 18));
    await invoice.write.cancel([result[0], BigInt(0)]);

    contractBalance = await token.read.balanceOf([invoice.address]);
    expect(contractBalance).equal(parseUnits("0", 18));

    payments = await invoice.read.getPayments([result[0]]);
    expect(payments[0].token).equal(
      "0x0000000000000000000000000000000000000000"
    );
  });
  it("send unique payment and confirm", async () => {
    const { invoice, owner, otherAccount, token, publicClient } =
      await loadFixture(deployFixture);

    await token.write.mint([owner.account.address]);
    await token.write.approve([invoice.address, parseUnits("100.0", 18)]);

    const id = stringToHex(nanoid(), { size: 32 });
    const dateTime: bigint[] = [];
    const stable: `0x${string}`[] = [];
    const amount: bigint[] = [];
    const payer: `0x${string}`[] = [];
    const receiver: `0x${string}`[] = [];

    const timestampSeconds = Math.floor(Date.now() / 1000);
    dateTime.push(BigInt(timestampSeconds - 100000000));
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
      account: otherAccount.account,
      address: invoice.address,
      abi: invoice.abi,
      functionName: "confirm",
      args: [result[0], BigInt(0)],
    });

    let ownerAccountBalance = await token.read.balanceOf([
      otherAccount.account.address,
    ]);
    expect(ownerAccountBalance).equal(parseUnits("0", 18));

    await otherAccount.writeContract(request);

    ownerAccountBalance = await token.read.balanceOf([
      otherAccount.account.address,
    ]);
    expect(ownerAccountBalance).equal(parseUnits("10.0", 18));
  });
  it("send request of payment two and confirm", async () => {
    const {
      invoice,
      owner,
      otherAccount,
      otherotherAccount,
      token,
      publicClient,
    } = await loadFixture(deployFixture);

    await token.write.mint([owner.account.address]);
    await token.write.approve([invoice.address, parseUnits("30.0", 18)]);

    const id = stringToHex(nanoid(), { size: 32 });
    const dateTime: bigint[] = [];
    const stable: `0x${string}`[] = [];
    const amount: bigint[] = [];
    const payer: `0x${string}`[] = [];
    const receiver: `0x${string}`[] = [];

    for (let index = 0; index < 2; index++) {
      const timestampSeconds = Math.floor(Date.now() / 1000);
      dateTime.push(BigInt(timestampSeconds - 100000000));
      stable.push(token.address);
      amount.push(parseUnits("10.0", 18));
      payer.push(owner.account.address);
      receiver.push(otherAccount.account.address);
    }
    receiver[1] = otherotherAccount.account.address;

    await invoice.write.createPayment([
      id,
      dateTime,
      stable,
      amount,
      payer,
      receiver,
    ]);

    await invoice.write.sendPayment([id, BigInt(0)]);
    await confirm(invoice.address, publicClient, otherAccount, 0, id);
    try {
      await confirm(invoice.address, publicClient, otherotherAccount, 1, id);
    } catch (error: any) {
      expect(error.message.toString().split("'")[1]).equal(
        "There are not enough tokens for payment."
      );
    }
  });
  it("send request of payment and confirm", async () => {
    const { invoice, owner, otherAccount, token, publicClient } =
      await loadFixture(deployFixture);

    await token.write.mint([owner.account.address]);
    await token.write.approve([invoice.address, parseUnits("100.0", 18)]);

    const id = stringToHex(nanoid(), { size: 32 });
    const dateTime: bigint[] = [];
    const stable: `0x${string}`[] = [];
    const amount: bigint[] = [];
    const payer: `0x${string}`[] = [];
    const receiver: `0x${string}`[] = [];

    const timestampSeconds = Math.floor(Date.now() / 1000);
    dateTime.push(BigInt(timestampSeconds - 100000000));
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
    let payments = await invoice.read.getPayments([result[0]]);
    await invoice.write.sendPayment([result[0], BigInt(0)]);

    let ownerAccountBalance = await token.read.balanceOf([
      otherAccount.account.address,
    ]);
    expect(ownerAccountBalance).equal(parseUnits("0", 18));

    await confirm(invoice.address, publicClient, otherAccount, 0, result[0]);
    payments = await invoice.read.getPayments([result[0]]);

    ownerAccountBalance = await token.read.balanceOf([
      otherAccount.account.address,
    ]);
    expect(ownerAccountBalance).equal(parseUnits("10.0", 18));
  });
  it("cancel unique payment but you are not payer", async () => {
    const { invoice, owner, token, publicClient } =
      await loadFixture(deployFixture);

    await token.write.mint([owner.account.address]);
    await token.write.approve([invoice.address, parseUnits("100.0", 18)]);

    const id = stringToHex(nanoid(), { size: 32 });
    const dateTime: bigint[] = [];
    const stable: `0x${string}`[] = [];
    const amount: bigint[] = [];
    const payer: `0x${string}`[] = [];
    const receiver: `0x${string}`[] = [];

    const timestampSeconds = Math.floor(Date.now() / 1000);
    const accountAddress: `0x${string}` = generateRandomHex();
    dateTime.push(BigInt(timestampSeconds - 100000000));
    stable.push(token.address);
    amount.push(parseUnits("10.0", 18));
    payer.push(accountAddress);
    receiver.push(generateRandomHex());

    await invoice.write.createPayment([
      id,
      dateTime,
      stable,
      amount,
      payer,
      receiver,
    ]);

    const result = await invoice.read.getHistory([accountAddress]);
    try {
      await invoice.write.cancel([result[0], BigInt(0)]);
    } catch (error: any) {
      expect(error.message.toString().split("'")[1]).equal(
        "Only payer or receiver can cancel payment."
      );
    }
  });
  it("send unique payment and confirm but are not at time", async () => {
    const { invoice, owner, otherAccount, token, publicClient } =
      await loadFixture(deployFixture);

    await token.write.mint([owner.account.address]);
    await token.write.approve([invoice.address, parseUnits("100.0", 18)]);

    const id = stringToHex(nanoid(), { size: 32 });
    const dateTime: bigint[] = [];
    const stable: `0x${string}`[] = [];
    const amount: bigint[] = [];
    const payer: `0x${string}`[] = [];
    const receiver: `0x${string}`[] = [];

    const timestampSeconds = Math.floor(Date.now() / 1000);
    dateTime.push(BigInt(timestampSeconds + 100000000));
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

    try {
      const { request } = await publicClient.simulateContract({
        account: otherAccount.account,
        address: invoice.address,
        abi: invoice.abi,
        functionName: "confirm",
        args: [result[0], BigInt(0)],
      });
      await otherAccount.writeContract(request);
    } catch (error: any) {
      expect(error.message.toString().split("'")[1]).equal(
        "Payment has not yet been unlock."
      );
    }
  });
  it("Create payment with zero amount", async () => {
    const { invoice, owner, otherAccount, token } =
      await loadFixture(deployFixture);

    await token.write.mint([owner.account.address]);
    await token.write.approve([invoice.address, parseUnits("100.0", 18)]);

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
      amount.push(parseUnits("0", 18));
      payer.push(owner.account.address);
      receiver.push(generateRandomHex());
    }

    try {
      await invoice.write.createPayment([
        id,
        dateTime,
        stable,
        amount,
        payer,
        receiver,
      ]);
    } catch (error: any) {
      expect(error.message.toString().split("'")[1]).equal(
        "The token amount cannot be zero."
      );
    }
  });
  it("paymento blocked for an account", async () => {
    const { invoice, owner, otherAccount, token, publicClient } =
      await loadFixture(deployFixture);

    await blocked(true, publicClient, otherAccount, invoice);

    await token.write.mint([owner.account.address]);
    await token.write.approve([invoice.address, parseUnits("100.0", 18)]);

    const id = stringToHex(nanoid(), { size: 32 });
    const dateTime: bigint[] = [];
    const stable: `0x${string}`[] = [];
    const amount: bigint[] = [];
    const payer: `0x${string}`[] = [];
    const receiver: `0x${string}`[] = [];

    const timestampSeconds = Math.floor(Date.now() / 1000);
    dateTime.push(BigInt(timestampSeconds - 100000000));
    stable.push(token.address);
    amount.push(parseUnits("10.0", 18));
    payer.push(otherAccount.account.address);
    receiver.push(owner.account.address);

    try {
      await invoice.write.createPayment([
        id,
        dateTime,
        stable,
        amount,
        payer,
        receiver,
      ]);
    } catch (error: any) {
      expect(error.message.toString().split("'")[1]).equal(
        "This account does not let anyone ask for payments."
      );
    }
  });
  it("paymento blocked for an account and unblocked", async () => {
    const { invoice, owner, otherAccount, token, publicClient } =
      await loadFixture(deployFixture);

    await blocked(true, publicClient, otherAccount, invoice);

    await token.write.mint([owner.account.address]);
    await token.write.approve([invoice.address, parseUnits("100.0", 18)]);

    const id = stringToHex(nanoid(), { size: 32 });
    const dateTime: bigint[] = [];
    const stable: `0x${string}`[] = [];
    const amount: bigint[] = [];
    const payer: `0x${string}`[] = [];
    const receiver: `0x${string}`[] = [];

    const timestampSeconds = Math.floor(Date.now() / 1000);
    dateTime.push(BigInt(timestampSeconds - 100000000));
    stable.push(token.address);
    amount.push(parseUnits("10.0", 18));
    payer.push(otherAccount.account.address);
    receiver.push(owner.account.address);

    try {
      await invoice.write.createPayment([
        id,
        dateTime,
        stable,
        amount,
        payer,
        receiver,
      ]);
    } catch (error: any) {
      expect(error.message.toString().split("'")[1]).equal(
        "This account does not let anyone ask for payments."
      );
    }

    await blocked(false, publicClient, otherAccount, invoice);
    await invoice.write.createPayment([
      id,
      dateTime,
      stable,
      amount,
      payer,
      receiver,
    ]);

    const result = await invoice.read.getHistory([owner.account.address]);
    expect(result.length).not.equal(0);
  });
});
async function confirm(
  contract: `0x${string}`,
  publicClient: PublicClient,
  otherAccount: any,
  index: number,
  id: `0x${string}`
) {
  const { request } = await publicClient.simulateContract({
    account: otherAccount.account,
    address: contract,
    abi: invoiceData.abi,
    functionName: "confirm",
    args: [id, BigInt(index.toString())],
  });
  await otherAccount.writeContract(request);
}

async function blocked(
  status: boolean,
  publicClient: any,
  otherAccount: any,
  invoice: any
) {
  let { request } = await publicClient.simulateContract({
    account: otherAccount.account,
    address: invoice.address,
    abi: invoice.abi,
    functionName: "setBlock",
    args: [status],
  });

  await otherAccount.writeContract(request);
}
