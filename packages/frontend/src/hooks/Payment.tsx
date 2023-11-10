"use client";
export type Payment = {
  dateTime: bigint;
  token: `0x${string}`;
  amount: bigint;
  payer: `0x${string}`;
  receiver: `0x${string}`;
  status: bigint;
};
