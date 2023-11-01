"use client";
export type Invoice = {
  receiver: `0x${string}`;
  token: `0x${string};`;
  payments: string;
  timestamp: bigint;
};

export type ResponseOff = {
  token: `0x${string}`;
  payments: Payments[];
};

export type Payments = {
  address: string;
  name: string;
  notes: string;
  quantity: number;
  amount: string;
};

export type ResponseOn = {
  receiver: `0x${string}`;
  amount: bigint;
};
export type FetchState = {
  data: Data | null;
  loading: boolean;
  error: Error | null;
  fetchData: any;
};
export type Data = {
  success: boolean;
  message: ResponseOff[] | string;
  total: number | null;
};
