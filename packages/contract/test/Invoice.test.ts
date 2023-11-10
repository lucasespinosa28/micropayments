import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { nanoid } from "nanoid";
import { PublicClient, parseUnits, stringToHex } from "viem";
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
  describe("Payment status", async () => {
    it("0: Payment was created", async () => {
      const { invoice, owner, token } = await loadFixture(deployFixture);
      const { id } = await createPayments(owner, invoice, token, 10);
      (await invoice.read.getPayments([id])).map((payment) => {
        expect(payment.status).equal(0n);
      });
    });
    it("1: Payment received tokens", async () => {
      const { invoice, owner, token } = await loadFixture(deployFixture);
      const { id } = await createPayments(owner, invoice, token, 10);
      for (let index = 0; index < 10; index++) {
        await invoice.write.sendPayment([id, BigInt(index)]);
      }
      (await invoice.read.getPayments([id])).map((payment) => {
        expect(payment.status).equal(1n);
      });
    });
    it("2: Payment has been confirmed by the receiver", async () => {
      const { invoice, owner, otherAccount, token, publicClient } =
        await loadFixture(deployFixture);
      const { id } = await createPayments(
        owner,
        invoice,
        token,
        1,
        otherAccount
      );
      await invoice.write.sendPayment([id, BigInt(0)]);
      await confirm(invoice.address, publicClient, otherAccount, 0, id);
      (await invoice.read.getPayments([id])).map((payment) => {
        expect(payment.status).equal(2n);
      });
    });
    it("3: Payment has been canceled", async () => {
      const { invoice, owner, token } = await loadFixture(deployFixture);
      const { id } = await createPayments(owner, invoice, token, 10);
      for (let index = 0; index < 10; index++) {
        await invoice.write.sendPayment([id, BigInt(index)]);
        await invoice.write.cancel([id, BigInt(index)]);
      }
      (await invoice.read.getPayments([id])).map((payment) => {
        expect(payment.status).equal(3n);
      });
    });
  });
  describe("transfer payments", async () => {
    it("loop payments", async () => {
      const { invoice, owner, token } = await loadFixture(deployFixture);
      const { id, receiver } = await createPayments(owner, invoice, token, 10);
      for (let index = 0; index < 10; index++) {
        await invoice.write.sendPayment([id, BigInt(index)]);
        await invoice.write.confirm([id, BigInt(index)]);
      }
      for (let index = 0; index < receiver.length; index++) {
        const balance = await token.read.balanceOf([receiver[index]]);
        expect(balance.toString()).to.equal("10000000000000000000");
      }
    });
    it("single payments", async () => {
      const { invoice, owner, token } = await loadFixture(deployFixture);
      const { id, receiver } = await createPayments(owner, invoice, token, 1);
      await invoice.write.sendPayment([id, BigInt(0)]);
      await invoice.write.confirm([id, BigInt(0)]);
      const balance = await token.read.balanceOf([receiver[0]]);
      expect(balance.toString()).to.equal("10000000000000000000");
    });
    it("request payment", async () => {
      const { invoice, owner, otherAccount, token, publicClient } =
        await loadFixture(deployFixture);
      const id = stringToHex(nanoid(), { size: 32 });
      const dateTime: bigint[] = [];
      const stable: `0x${string}`[] = [];
      const amount: bigint[] = [];
      const payer: `0x${string}`[] = [];
      const receiver: `0x${string}`[] = [];

      async function create() {
        const timestampSeconds = Math.floor(Date.now() / 1000);
        dateTime.push(BigInt(timestampSeconds - 10000));
        stable.push(token.address);
        amount.push(parseUnits("10.0", 18));
        payer.push(owner.account.address);
        receiver.push(otherAccount.account.address);

        const { request } = await publicClient.simulateContract({
          account: otherAccount.account,
          address: invoice.address,
          abi: invoiceData.abi,
          functionName: "createPayment",
          args: [id, dateTime, stable, amount, payer, receiver],
        });
        await otherAccount.writeContract(request);
      }

      await create();
      await token.write.mint([owner.account.address]);
      await token.write.approve([invoice.address, parseUnits("10.0", 18)]);
      await invoice.write.sendPayment([id, BigInt(0)]);
      await invoice.write.confirm([id, BigInt(0)]);
      const balance = await token.read.balanceOf([
        otherAccount.account.address,
      ]);
      expect(balance.toString()).to.equal("10000000000000000000");
    });
    it("paid by third party", async () => {
      const {
        invoice,
        owner,
        otherAccount,
        otherotherAccount,
        token,
        publicClient,
      } = await loadFixture(deployFixture);
      const { id } = await createPayments(
        owner,
        invoice,
        token,
        1,
        otherAccount
      );

      async function approve() {
        await token.write.mint([otherotherAccount.account.address]);
        const { request } = await publicClient.simulateContract({
          account: otherotherAccount.account,
          address: token.address,
          abi: token.abi,
          functionName: "approve",
          args: [invoice.address, parseUnits("10.0", 18)],
        });
        await otherotherAccount.writeContract(request);
      }
      await approve();

      async function sendPaymentOther() {
        const { request } = await publicClient.simulateContract({
          account: otherotherAccount.account,
          address: invoice.address,
          abi: invoice.abi,
          functionName: "sendPayment",
          args: [id, BigInt(0)],
        });
        await otherotherAccount.writeContract(request);
      }
      await sendPaymentOther();
      await invoice.write.confirm([id, BigInt(0)]);
      const balance = await token.read.balanceOf([
        otherAccount.account.address,
      ]);
      expect(balance.toString()).to.equal("10000000000000000000");
    });
    it("trying to pay confirmed payment", async () => {
      const { invoice, owner, otherAccount, token } =
        await loadFixture(deployFixture);
      const { id } = await createPayments(
        owner,
        invoice,
        token,
        1,
        otherAccount
      );

      await sendPaymentOnwer(token, invoice, id, 0);

      expect(
        (await token.read.balanceOf([otherAccount.account.address])).toString()
      ).equal("0");
      await invoice.write.confirm([id, BigInt(0)]);
      expect(
        (await token.read.balanceOf([otherAccount.account.address])).toString()
      ).equal("10000000000000000000");
      expect((await token.read.balanceOf([invoice.address])).toString()).equal(
        "0"
      );

      (await invoice.read.getPayments([id])).map((payment) => {
        expect(payment.status).equal(2n);
      });
      try {
        await invoice.write.sendPayment([id, BigInt(0)]);
      } catch (error: any) {
        expect(error.message.toString()).include(
          "Payment has already been paid or canceled."
        );
      }
    });
    it("trying to pay canceled payment", async () => {
      const { invoice, owner, token } = await loadFixture(deployFixture);
      const { id } = await createPayments(owner, invoice, token, 10);

      const initial: bigint = await token.read.balanceOf([invoice.address]);
      let before: bigint = 0n;
      let after: bigint = 0n;

      for (let index = 0; index < 10; index++) {
        await invoice.write.sendPayment([id, BigInt(index)]);
        before = await token.read.balanceOf([invoice.address]);
        await invoice.write.cancel([id, BigInt(index)]);
      }
      after = await token.read.balanceOf([invoice.address]);
      (await invoice.read.getPayments([id])).map((payment) => {
        expect(payment.status).equal(3n);
      });
      expect({ initial, before, after }).deep.equal({
        initial: 0n,
        before: 10000000000000000000n,
        after: 0n,
      });
      try {
        await invoice.write.sendPayment([id, BigInt(0)]);
      } catch (error: any) {
        expect(error.message.toString()).include(
          "Payment has already been paid or canceled."
        );
      }
    });
    it("trying to create a payment with blocked payer", async () => {
      const { invoice, owner, otherAccount, token, publicClient } =
        await loadFixture(deployFixture);
      await blocked(true, publicClient, otherAccount, invoice);
      const id = stringToHex(nanoid(), { size: 32 });
      const dateTime: bigint[] = [];
      const stable: `0x${string}`[] = [];
      const amount: bigint[] = [];
      const payer: `0x${string}`[] = [];
      const receiver: `0x${string}`[] = [];

      const timestampSeconds = Math.floor(Date.now() / 1000);
      dateTime.push(BigInt(timestampSeconds - 10000));
      stable.push(token.address);
      amount.push(parseUnits("10.0", 18));
      payer.push(otherAccount.account.address);
      receiver.push(owner.account.address);
      try {
        await publicClient.simulateContract({
          account: owner.account,
          address: invoice.address,
          abi: invoiceData.abi,
          functionName: "createPayment",
          args: [id, dateTime, stable, amount, payer, receiver],
        });
      } catch (error: any) {
        expect(error.message.toString()).include(
          "This account does not let anyone ask for payments."
        );
      }
    })
  });
  describe("cancellation scenarios", async () => {
    describe("Payer", async () => {
      it("cancel payment with status 0:create", async () => {
        const { invoice, owner, token } = await loadFixture(deployFixture);
        const { id } = await createPayments(owner, invoice, token, 10);
        for (let index = 0; index < 10; index++) {
          await invoice.write.cancel([id, BigInt(index)]);
        }
        (await invoice.read.getPayments([id])).map((payment) => {
          expect(payment.status).equal(3n);
        });
      });
      it("cancel payment with status 1:deposit", async () => {
        const { invoice, owner, token } = await loadFixture(deployFixture);
        const { id } = await createPayments(owner, invoice, token, 10);

        const initial: bigint = await token.read.balanceOf([invoice.address]);
        let before: bigint = 0n;
        let after: bigint = 0n;

        for (let index = 0; index < 10; index++) {
          await invoice.write.sendPayment([id, BigInt(index)]);
          before = await token.read.balanceOf([invoice.address]);
          await invoice.write.cancel([id, BigInt(index)]);
        }
        after = await token.read.balanceOf([invoice.address]);
        (await invoice.read.getPayments([id])).map((payment) => {
          expect(payment.status).equal(3n);
        });
        expect({ initial, before, after }).deep.equal({
          initial: 0n,
          before: 10000000000000000000n,
          after: 0n,
        });
      });
      it("cancel payment with status 2:confirmed", async () => {
        const { invoice, owner, otherAccount, token, publicClient } =
          await loadFixture(deployFixture);
        const { id } = await createPayments(
          owner,
          invoice,
          token,
          1,
          otherAccount
        );
        await invoice.write.sendPayment([id, BigInt(0)]);
        await confirm(invoice.address, publicClient, otherAccount, 0, id);
        try {
          await invoice.write.cancel([id, BigInt(0)]);
        } catch (error: any) {
          expect(error.message.toString()).include(
            "It is not possible to cancel completed payment or canceled."
          );
        }
        (await invoice.read.getPayments([id])).map((payment) => {
          expect(payment.status).equal(2n);
        });
      });
      it("cancel payment with status 3:canceled", async () => {
        const { invoice, owner, token } = await loadFixture(deployFixture);
        const { id } = await createPayments(owner, invoice, token, 10);
        for (let index = 0; index < 10; index++) {
          await invoice.write.sendPayment([id, BigInt(index)]);
          await invoice.write.cancel([id, BigInt(index)]);
          try {
            await invoice.write.cancel([id, BigInt(index)]);
          } catch (error: any) {
            expect(error.message.toString()).include(
              "It is not possible to cancel completed payment or canceled."
            );
          }
        }
        (await invoice.read.getPayments([id])).map((payment) => {
          expect(payment.status).equal(3n);
        });
      });
    });
    describe("Receiver", async () => {
      it("cancel payment with status 0:create", async () => {
        const { invoice, owner, otherAccount, token, publicClient } =
          await loadFixture(deployFixture);
        const { id } = await createPayments(
          owner,
          invoice,
          token,
          1,
          otherAccount
        );
        await cancel(invoice.address, publicClient, otherAccount, 0, id);
        (await invoice.read.getPayments([id])).map((payment) => {
          expect(payment.status).equal(3n);
        });
      });
      it("cancel payment with status 1:deposit", async () => {
        const { invoice, owner, token, publicClient, otherAccount } =
          await loadFixture(deployFixture);
        const { id } = await createPayments(
          owner,
          invoice,
          token,
          1,
          otherAccount
        );

        const initial: bigint = await token.read.balanceOf([invoice.address]);
        let before = 0n;
        let after: bigint = 0n;

        await invoice.write.sendPayment([id, BigInt(0)]);
        before = await token.read.balanceOf([invoice.address]);
        await cancel(invoice.address, publicClient, otherAccount, 0, id);
        after = await token.read.balanceOf([invoice.address]);
        (await invoice.read.getPayments([id])).map((payment) => {
          expect(payment.status).equal(3n);
        });
        expect({ initial, before, after }).deep.equal({
          initial: 0n,
          before: 10000000000000000000n,
          after: 0n,
        });
      });
      it("cancel payment with status 2:confirmed", async () => {
        const { invoice, owner, otherAccount, token, publicClient } =
          await loadFixture(deployFixture);
        const { id } = await createPayments(
          owner,
          invoice,
          token,
          1,
          otherAccount
        );
        await invoice.write.sendPayment([id, BigInt(0)]);
        await confirm(invoice.address, publicClient, otherAccount, 0, id);
        try {
          await cancel(invoice.address, publicClient, otherAccount, 0, id);
        } catch (error: any) {
          expect(error.message.toString()).include(
            "It is not possible to cancel completed payment or canceled."
          );
        }
        (await invoice.read.getPayments([id])).map((payment) => {
          expect(payment.status).equal(2n);
        });
      });
      it("cancel payment with status 3:canceled", async () => {
        const { invoice, owner, token, publicClient, otherAccount } =
          await loadFixture(deployFixture);
        const { id } = await createPayments(
          owner,
          invoice,
          token,
          1,
          otherAccount
        );
        await invoice.write.sendPayment([id, BigInt(0)]);
        await cancel(invoice.address, publicClient, otherAccount, 0, id);
        try {
          await invoice.write.cancel([id, BigInt(0)]);
        } catch (error: any) {
          expect(error.message.toString()).include(
            "It is not possible to cancel completed payment or canceled."
          );
        }
        (await invoice.read.getPayments([id])).map((payment) => {
          expect(payment.status).equal(3n);
        });
      });
    });
    describe("Not receiver", async () => {
      it("cancel payment with status 0:create", async () => {
        const {
          invoice,
          owner,
          otherAccount,
          otherotherAccount,
          token,
          publicClient,
        } = await loadFixture(deployFixture);
        const { id } = await createPayments(
          owner,
          invoice,
          token,
          1,
          otherAccount
        );
        try {
          await cancel(invoice.address, publicClient, otherotherAccount, 0, id);
        } catch (error: any) {
          expect(error.message.toString()).include(
            "Only payer or receiver can cancel payment."
          );
        }
      });
      it("cancel payment with status 1:deposit", async () => {
        const {
          invoice,
          owner,
          token,
          publicClient,
          otherAccount,
          otherotherAccount,
        } = await loadFixture(deployFixture);
        const { id } = await createPayments(
          owner,
          invoice,
          token,
          1,
          otherAccount
        );

        const initial: bigint = await token.read.balanceOf([invoice.address]);
        let before = 0n;
        let after: bigint = 0n;

        await invoice.write.sendPayment([id, BigInt(0)]);
        before = await token.read.balanceOf([invoice.address]);
        try {
          await cancel(invoice.address, publicClient, otherotherAccount, 0, id);
        } catch (error: any) {
          expect(error.message.toString()).include(
            "Only payer or receiver can cancel payment."
          );
        }
        after = await token.read.balanceOf([invoice.address]);
        (await invoice.read.getPayments([id])).map((payment) => {
          expect(payment.status).equal(1n);
        });
        expect({ initial, before, after }).deep.equal({
          initial: 0n,
          before: 10000000000000000000n,
          after: 10000000000000000000n,
        });
      });
      it("cancel payment with status 2:confirmed", async () => {
        const {
          invoice,
          owner,
          otherAccount,
          token,
          publicClient,
          otherotherAccount,
        } = await loadFixture(deployFixture);
        const { id } = await createPayments(
          owner,
          invoice,
          token,
          1,
          otherAccount
        );
        await invoice.write.sendPayment([id, BigInt(0)]);
        await confirm(invoice.address, publicClient, otherAccount, 0, id);
        try {
          await cancel(invoice.address, publicClient, otherotherAccount, 0, id);
        } catch (error: any) {
          expect(error.message.toString()).include(
            "It is not possible to cancel completed payment or canceled."
          );
        }
        (await invoice.read.getPayments([id])).map((payment) => {
          expect(payment.status).equal(2n);
        });
      });
      it("cancel payment with status 3:canceled", async () => {
        const {
          invoice,
          owner,
          token,
          publicClient,
          otherAccount,
          otherotherAccount,
        } = await loadFixture(deployFixture);
        const { id } = await createPayments(
          owner,
          invoice,
          token,
          1,
          otherAccount
        );
        await invoice.write.sendPayment([id, BigInt(0)]);
        await cancel(invoice.address, publicClient, otherAccount, 0, id);
        try {
          await cancel(invoice.address, publicClient, otherotherAccount, 0, id);
        } catch (error: any) {
          expect(error.message.toString()).include(
            "It is not possible to cancel completed payment or canceled."
          );
        }
        (await invoice.read.getPayments([id])).map((payment) => {
          expect(payment.status).equal(3n);
        });
      });
    });
  });
  describe("confirmations scenarios", async () => {
    describe("payer", () => {
      it("single payment and confirm", async () => {
        const { invoice, owner, otherAccount, token } =
          await loadFixture(deployFixture);
        const { id } = await createPayments(
          owner,
          invoice,
          token,
          1,
          otherAccount
        );

        await sendPaymentOnwer(token, invoice, id, 0);

        expect(
          (
            await token.read.balanceOf([otherAccount.account.address])
          ).toString()
        ).equal("0");
        await invoice.write.confirm([id, BigInt(0)]);
        expect(
          (
            await token.read.balanceOf([otherAccount.account.address])
          ).toString()
        ).equal("10000000000000000000");
        expect(
          (await token.read.balanceOf([invoice.address])).toString()
        ).equal("0");

        (await invoice.read.getPayments([id])).map((payment) => {
          expect(payment.status).equal(2n);
        });
      });
      it("tries to confirm a payment without having tokens deposited", async () => {
        const { invoice, owner, otherAccount, token } =
          await loadFixture(deployFixture);
        const { id } = await createPayments(
          owner,
          invoice,
          token,
          1,
          otherAccount
        );
        expect(
          (await token.read.balanceOf([invoice.address])).toString()
        ).equal("0");
        expect(
          (
            await token.read.balanceOf([otherAccount.account.address])
          ).toString()
        ).equal("0");

        try {
          await invoice.write.confirm([id, BigInt(0)]);
        } catch (error: any) {
          expect(error.message.toString()).include(
            "There are not enough tokens for payment."
          );
        }

        expect(
          (await token.read.balanceOf([invoice.address])).toString()
        ).equal("0");
        (await invoice.read.getPayments([id])).map((payment) => {
          expect(payment.status).equal(0n);
        });
      });
      it("try to confirm that it has already been confirmed", async () => {
        const { invoice, owner, otherAccount, token, publicClient } =
          await loadFixture(deployFixture);
        const { id } = await createPayments(
          owner,
          invoice,
          token,
          1,
          otherAccount
        );

        await sendPaymentOnwer(token, invoice, id, 0);

        expect(
          (
            await token.read.balanceOf([otherAccount.account.address])
          ).toString()
        ).equal("0");
        await invoice.write.confirm([id, BigInt(0)]);
        expect(
          (
            await token.read.balanceOf([otherAccount.account.address])
          ).toString()
        ).equal("10000000000000000000");
        expect(
          (await token.read.balanceOf([invoice.address])).toString()
        ).equal("0");

        try {
          await invoice.write.confirm([id, BigInt(0)]);
        } catch (error: any) {
          expect(error.message.toString()).include(
            "This payment has already been confirmed."
          );
        }

        (await invoice.read.getPayments([id])).map((payment) => {
          expect(payment.status).equal(2n);
        });
      });
      it("try to confirm that it has been canceled", async () => {
        const { invoice, owner, token } = await loadFixture(deployFixture);
        const { id } = await createPayments(owner, invoice, token, 1);

        const initial: bigint = await token.read.balanceOf([invoice.address]);
        let before: bigint = 0n;
        let after: bigint = 0n;

        await sendPaymentOnwer(token, invoice, id, 0);
        before = await token.read.balanceOf([invoice.address]);
        await invoice.write.cancel([id, BigInt(0)]);
        after = await token.read.balanceOf([invoice.address]);
        (await invoice.read.getPayments([id])).map((payment) => {
          expect(payment.status).equal(3n);
        });
        expect({ initial, before, after }).deep.equal({
          initial: 0n,
          before: 10000000000000000000n,
          after: 0n,
        });
        try {
          await invoice.write.confirm([id, BigInt(0)]);
        } catch (error: any) {
          expect(error.message.toString()).include(
            "This payment has already been canceled."
          );
        }
      });
      it("try to confirm a payment that has not yet been unlock", async () => {
        const { invoice, owner, otherAccount, token, publicClient } =
          await loadFixture(deployFixture);
        const id = stringToHex(nanoid(), { size: 32 });
        const dateTime: bigint[] = [];
        const stable: `0x${string}`[] = [];
        const amount: bigint[] = [];
        const payer: `0x${string}`[] = [];
        const receiver: `0x${string}`[] = [];

        const timestampSeconds = Math.floor(Date.now() / 1000);
        dateTime.push(BigInt(timestampSeconds + 100));
        stable.push(token.address);
        amount.push(parseUnits("10.0", 18));
        payer.push(owner.account.address);
        receiver.push(otherAccount.account.address);
        await invoice.write.createPayment([id, dateTime, stable, amount, payer, receiver]);
        await token.write.mint([owner.account.address]);
        await token.write.approve([invoice.address, parseUnits("10.0", 18)]);
        await invoice.write.sendPayment([id, BigInt(0)]);
        try {
          await invoice.write.confirm([id, BigInt(0)]);
        } catch (error: any) {
          expect(error.message.toString()).include(
            "Payment has not yet been unlock."
          );
        }
      });
    });
    describe("reicever", () => {
      it("single payment and confirm", async () => {
        const { invoice, owner, otherAccount, token, publicClient } =
          await loadFixture(deployFixture);
        const { id } = await createPayments(
          owner,
          invoice,
          token,
          1,
          otherAccount
        );

        await sendPaymentOnwer(token, invoice, id, 0);

        expect(
          (
            await token.read.balanceOf([otherAccount.account.address])
          ).toString()
        ).equal("0");
        await confirm(invoice.address, publicClient, otherAccount, 0, id);
        expect(
          (
            await token.read.balanceOf([otherAccount.account.address])
          ).toString()
        ).equal("10000000000000000000");
        expect(
          (await token.read.balanceOf([invoice.address])).toString()
        ).equal("0");

        (await invoice.read.getPayments([id])).map((payment) => {
          expect(payment.status).equal(2n);
        });
      });
      it("tries to confirm a payment without having tokens deposited", async () => {
        const { invoice, owner, otherAccount, token, publicClient } =
          await loadFixture(deployFixture);
        const { id } = await createPayments(
          owner,
          invoice,
          token,
          1,
          otherAccount
        );
        expect(
          (await token.read.balanceOf([invoice.address])).toString()
        ).equal("0");
        expect(
          (
            await token.read.balanceOf([otherAccount.account.address])
          ).toString()
        ).equal("0");

        try {
          await confirm(invoice.address, publicClient, otherAccount, 0, id);
        } catch (error: any) {
          expect(error.message.toString()).include(
            "There are not enough tokens for payment."
          );
        }

        expect(
          (await token.read.balanceOf([invoice.address])).toString()
        ).equal("0");
        (await invoice.read.getPayments([id])).map((payment) => {
          expect(payment.status).equal(0n);
        });
      });
      it("try to confirm that it has already been confirmed", async () => {
        const { invoice, owner, otherAccount, token, publicClient } =
          await loadFixture(deployFixture);
        const { id } = await createPayments(
          owner,
          invoice,
          token,
          1,
          otherAccount
        );

        await sendPaymentOnwer(token, invoice, id, 0);

        expect(
          (
            await token.read.balanceOf([otherAccount.account.address])
          ).toString()
        ).equal("0");
        await confirm(invoice.address, publicClient, otherAccount, 0, id);
        expect(
          (
            await token.read.balanceOf([otherAccount.account.address])
          ).toString()
        ).equal("10000000000000000000");
        expect(
          (await token.read.balanceOf([invoice.address])).toString()
        ).equal("0");

        try {
          await confirm(invoice.address, publicClient, otherAccount, 0, id);
        } catch (error: any) {
          expect(error.message.toString()).include(
            "This payment has already been confirmed."
          );
        }

        (await invoice.read.getPayments([id])).map((payment) => {
          expect(payment.status).equal(2n);
        });
      });
      it("try to confirm that it has been canceled", async () => {
        const { invoice, owner, token } = await loadFixture(deployFixture);
        const { id } = await createPayments(owner, invoice, token, 1);

        const initial: bigint = await token.read.balanceOf([invoice.address]);
        let before: bigint = 0n;
        let after: bigint = 0n;

        await invoice.write.sendPayment([id, BigInt(0)]);
        before = await token.read.balanceOf([invoice.address]);
        await invoice.write.cancel([id, BigInt(0)]);
        after = await token.read.balanceOf([invoice.address]);
        (await invoice.read.getPayments([id])).map((payment) => {
          expect(payment.status).equal(3n);
        });
        expect({ initial, before, after }).deep.equal({
          initial: 0n,
          before: 10000000000000000000n,
          after: 0n,
        });
        try {
          await invoice.write.confirm([id, BigInt(0)]);
        } catch (error: any) {
          expect(error.message.toString()).include(
            "This payment has already been canceled."
          );
        }
      });
      it("try to confirm a payment that has not yet been unlock", async () => {
        const { invoice, owner, otherAccount, token, publicClient } =
          await loadFixture(deployFixture);
        const id = stringToHex(nanoid(), { size: 32 });
        const dateTime: bigint[] = [];
        const stable: `0x${string}`[] = [];
        const amount: bigint[] = [];
        const payer: `0x${string}`[] = [];
        const receiver: `0x${string}`[] = [];

        const timestampSeconds = Math.floor(Date.now() / 1000);
        dateTime.push(BigInt(timestampSeconds + 100));
        stable.push(token.address);
        amount.push(parseUnits("10.0", 18));
        payer.push(owner.account.address);
        receiver.push(otherAccount.account.address);
        await invoice.write.createPayment([id, dateTime, stable, amount, payer, receiver]);
        await token.write.mint([owner.account.address]);
        await token.write.approve([invoice.address, parseUnits("10.0", 18)]);
        await invoice.write.sendPayment([id, BigInt(0)]);
        try {
          await confirm(invoice.address, publicClient, otherAccount, 0, id);;
        } catch (error: any) {
          expect(error.message.toString()).include(
            "Payment has not yet been unlock."
          );
        }
      });
    });
    describe("other", () => {
      it("tries to confirm payment that is not from that receiver", async () => {
        const {
          invoice,
          owner,
          otherAccount,
          otherotherAccount,
          token,
          publicClient,
        } = await loadFixture(deployFixture);
        const { id } = await createPayments(
          owner,
          invoice,
          token,
          1,
          otherAccount
        );

        await sendPaymentOnwer(token, invoice, id, 0);

        expect(
          (
            await token.read.balanceOf([otherAccount.account.address])
          ).toString()
        ).equal("0");
        try {
          await confirm(
            invoice.address,
            publicClient,
            otherotherAccount,
            0,
            id
          );
        } catch (error: any) {
          expect(error.message.toString()).include(
            "Only payer or receiver can confirm payment."
          );
        }
        expect(
          (
            await token.read.balanceOf([otherAccount.account.address])
          ).toString()
        ).equal("0");
        expect(
          (await token.read.balanceOf([invoice.address])).toString()
        ).equal("10000000000000000000");

        (await invoice.read.getPayments([id])).map((payment) => {
          expect(payment.status).equal(1n);
        });
      });
      it("tries to confirm a payment without having tokens deposited", async () => {
        const {
          invoice,
          owner,
          otherAccount,
          otherotherAccount,
          token,
          publicClient,
        } = await loadFixture(deployFixture);
        const { id } = await createPayments(
          owner,
          invoice,
          token,
          1,
          otherAccount
        );
        expect(
          (await token.read.balanceOf([invoice.address])).toString()
        ).equal("0");
        expect(
          (
            await token.read.balanceOf([otherAccount.account.address])
          ).toString()
        ).equal("0");

        try {
          await confirm(
            invoice.address,
            publicClient,
            otherotherAccount,
            0,
            id
          );
        } catch (error: any) {
          expect(error.message.toString()).include(
            "There are not enough tokens for payment."
          );
        }

        expect(
          (await token.read.balanceOf([invoice.address])).toString()
        ).equal("0");
        (await invoice.read.getPayments([id])).map((payment) => {
          expect(payment.status).equal(0n);
        });
      });
      it("try to confirm that it has already been confirmed", async () => {
        const {
          invoice,
          owner,
          otherAccount,
          otherotherAccount,
          token,
          publicClient,
        } = await loadFixture(deployFixture);
        const { id } = await createPayments(
          owner,
          invoice,
          token,
          1,
          otherAccount
        );

        await sendPaymentOnwer(token, invoice, id, 0);

        expect(
          (
            await token.read.balanceOf([otherAccount.account.address])
          ).toString()
        ).equal("0");
        await confirm(invoice.address, publicClient, otherAccount, 0, id);
        expect(
          (
            await token.read.balanceOf([otherAccount.account.address])
          ).toString()
        ).equal("10000000000000000000");
        expect(
          (await token.read.balanceOf([invoice.address])).toString()
        ).equal("0");

        try {
          await confirm(
            invoice.address,
            publicClient,
            otherotherAccount,
            0,
            id
          );
        } catch (error: any) {
          expect(error.message.toString()).include(
            "This payment has already been confirmed."
          );
        }

        (await invoice.read.getPayments([id])).map((payment) => {
          expect(payment.status).equal(2n);
        });
      });
      it("try to confirm that it has been canceled", async () => {
        const { invoice, owner, token, publicClient, otherotherAccount } =
          await loadFixture(deployFixture);
        const { id } = await createPayments(owner, invoice, token, 1);

        const initial: bigint = await token.read.balanceOf([invoice.address]);
        let before: bigint = 0n;
        let after: bigint = 0n;

        await invoice.write.sendPayment([id, BigInt(0)]);
        before = await token.read.balanceOf([invoice.address]);
        await invoice.write.cancel([id, BigInt(0)]);
        after = await token.read.balanceOf([invoice.address]);
        (await invoice.read.getPayments([id])).map((payment) => {
          expect(payment.status).equal(3n);
        });
        expect({ initial, before, after }).deep.equal({
          initial: 0n,
          before: 10000000000000000000n,
          after: 0n,
        });
        try {
          await confirm(
            invoice.address,
            publicClient,
            otherotherAccount,
            0,
            id
          );
        } catch (error: any) {
          expect(error.message.toString()).include(
            "This payment has already been canceled."
          );
        }
      });
    });
  });
});
async function sendPaymentOnwer(
  token: any,
  invoice: any,
  id: string,
  index: number
) {
  expect((await token.read.balanceOf([invoice.address])).toString()).equal("0");
  await invoice.write.sendPayment([id, BigInt(index)]);
  expect((await token.read.balanceOf([invoice.address])).toString()).not.equal(
    "0"
  );
}

async function createPayments(
  account: any,
  invoice: any,
  token: any,
  loop: number,
  otherAccount?: any
) {
  await token.write.mint([account.account.address]);
  await token.write.approve([invoice.address, parseUnits("100.0", 18)]);

  const id = stringToHex(nanoid(), { size: 32 });
  const dateTime: bigint[] = [];
  const stable: `0x${string}`[] = [];
  const amount: bigint[] = [];
  const payer: `0x${string}`[] = [];
  const receiver: `0x${string}`[] = [];

  for (let index = 0; index < loop; index++) {
    const timestampSeconds = Math.floor(Date.now() / 1000);
    dateTime.push(BigInt(timestampSeconds - 10000));
    stable.push(token.address);
    amount.push(parseUnits("10.0", 18));
    payer.push(account.account.address);
    otherAccount
      ? receiver.push(otherAccount.account.address)
      : receiver.push(generateRandomHex());
  }

  await invoice.write.createPayment([
    id,
    dateTime,
    stable,
    amount,
    payer,
    receiver,
  ]);
  return { id, receiver };
}

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

async function cancel(
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
    functionName: "cancel",
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
