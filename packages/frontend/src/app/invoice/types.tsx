"use client";
export type Payments = {
  address: string;
  name: string;
  notes: string;
  quantity: number;
  amount: string;
};

export type FetchState = {
  data: Data | null;
  loading: boolean;
  error: Error | null;
};

export type Data = {
  success: boolean;
  message: string;
  total: number | null;
};

export type UploadData = {
  name: string;
  body: {
    token:`0x${string}`
    payments:Payments[]
  }
};
