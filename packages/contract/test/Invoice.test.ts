import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { v4 as uuidv4 } from "uuid";
import { parseUnits } from "viem";

function generateRandomHex(): `0x${string}` {
  let result: `0x${string}` = "0x";
  let characters = "0123456789abcdef";
  for (let i = 0; i < 40; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

describe("Invoice", function () {
  async function deployFixture() {
    const [owner, otherAccount] = await hre.viem.getWalletClients();
    const invoice = await hre.viem.deployContract("Invoice");
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

  it("should deploy new token", async function () {
    const { token, owner } = await loadFixture(deployFixture);
    await token.write.mint([owner.account.address]);
    await token.write.approve([token.address, parseUnits("100", 18)]);
    const result = await token.read.balanceOf([owner.account.address]);
    expect(result.toString()).equal("1000000000000000000000000");
  });
  it("Should create a new invoice", async function () {
    const { invoice, token, owner, otherAccount } = await loadFixture(
      deployFixture
    );
    await token.write.mint([owner.account.address]);
    await token.write.approve([invoice.address, parseUnits("100", 18)]);
    const id = uuidv4();
    const receivers = [
      generateRandomHex(),
      generateRandomHex(),
      generateRandomHex(),
    ];
    const amounts = [
      parseUnits("1", 18),
      parseUnits("1", 18),
      parseUnits("1", 18),
    ];
    await invoice.write.create([
      true,
      id,
      token.address,
      otherAccount.account.address,
      owner.account.address,
      receivers,
      amounts,
    ]);
    const resulthistory = await invoice.read.getHistory([
      owner.account.address,
    ]);
    expect(resulthistory[0]).equal(id);
    const resulPayments = await invoice.read.getPayments([resulthistory[0]]);
    for (let index = 0; index < resulPayments.length; index++) {
      expect(resulPayments[index].receiver.toLowerCase()).equal(
        receivers[index].toLowerCase()
      );
      expect(resulPayments[index].amount).equal(amounts[index]);
    }

    const resultInvoice = await invoice.read.getInvoice([resulthistory[0]]);
    expect(
      JSON.stringify({
        token: resultInvoice.token.toLowerCase(),
        payments: resultInvoice.payments,
      })
    ).equal(
      JSON.stringify({
        token: token.address.toLowerCase(),
        payments: id,
      })
    );

    for (let index = 0; index < receivers.length; index++) {
      const balance = await token.read.balanceOf([receivers[index]]);
      expect(balance.toString()).equal(amounts[index].toString());
    }
  });
  it("Should create a invoice with 100 payment", async function () {
    const { invoice, token, owner, otherAccount } = await loadFixture(
      deployFixture
    );
    await token.write.mint([owner.account.address]);
    await token.write.approve([invoice.address, parseUnits("2000", 18)]);
    const id = uuidv4();
    let receivers:`0x${string}`[] = [];
    let amounts:bigint[] = [];
    for (let index = 0; index < 100; index++) {
      receivers[index] = generateRandomHex();
      amounts[index] = parseUnits("1", 18);

    }
    await invoice.write.create([
      true,
      id,
      token.address,
      otherAccount.account.address,
      owner.account.address,
      receivers,
      amounts,
    ]);
    const resulthistory = await invoice.read.getHistory([
      owner.account.address,
    ]);
    expect(resulthistory[0]).equal(id);
    const resulPayments = await invoice.read.getPayments([resulthistory[0]]);
    for (let index = 0; index < resulPayments.length; index++) {
      expect(resulPayments[index].receiver.toLowerCase()).equal(
        receivers[index].toLowerCase()
      );
      expect(resulPayments[index].amount).equal(amounts[index]);
    }

    const resultInvoice = await invoice.read.getInvoice([resulthistory[0]]);
    expect(
      JSON.stringify({
        token: resultInvoice.token.toLowerCase(),
        payments: resultInvoice.payments,
      })
    ).equal(
      JSON.stringify({
        token: token.address.toLowerCase(),
        payments: id,
      })
    );

    for (let index = 0; index < receivers.length; index++) {
      const balance = await token.read.balanceOf([receivers[index]]);
      expect(balance.toString()).equal(amounts[index].toString());
    }
  });
  it("Should create a invoice with 1000 payment", async function () {
    const { invoice, token, owner, otherAccount } = await loadFixture(
      deployFixture
    );
    await token.write.mint([owner.account.address]);
    await token.write.approve([invoice.address, parseUnits("2000", 18)]);
    const id = uuidv4();
    let receivers:`0x${string}`[] = [];
    let amounts:bigint[] = [];
    for (let index = 0; index < 1000; index++) {
      receivers[index] = generateRandomHex();
      amounts[index] = parseUnits("1", 18);

    }
    await invoice.write.create([
      false,
      id,
      token.address,
      otherAccount.account.address,
      owner.account.address,
      receivers,
      amounts,
    ]);
    for (let index = 0; index < receivers.length; index++) {
      const balance = await token.read.balanceOf([receivers[index]]);
      expect(balance.toString()).equal(amounts[index].toString());
    }
  });
});
