"use client";
export type Invoice = {
  receiver: `0x${string}`;
  token: `0x${string};`;
  payments: string;
  timestamp: bigint;
};

export type ResponseOff = {
  address: string;
  name: string;
  notes: string;
  qty: number;
  amount: string;
};

export type ResponseOn = {
  receiver: `0x${string}`;
  amount: bigint;
};export type FetchState = {
  data: Data | null;
  loading: boolean;
  error: Error | null;
};
export type Data = {
  success: boolean;
  message: ResponseOff[];
  total: number | null;
};

