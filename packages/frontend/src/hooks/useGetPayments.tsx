"use client";
import { useContractRead } from "wagmi";
import { abi } from "../Invoice.json";
import { Payment } from "./Payment";
import { paymentsContract } from "@/contract";

export const useGetPayments = (id: `0x${string}`) => {
  const { data, isError, isLoading, error, isSuccess } = useContractRead({
    address: paymentsContract,
    abi: abi,
    functionName: "getPayments",
    args: [id],
  });
  const payments: Payment[] = data as Payment[];
  return { payments, isError, error, isLoading, isSuccess };
};
