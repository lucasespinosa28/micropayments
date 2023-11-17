"use client";
import { useContractRead } from "wagmi";
import { abi } from "../Invoice.json";
import { paymentsContract } from "@/contract";

export const useGetHistory = (address: `0x${string}`) => {
  const { data, isError, isLoading, error, isSuccess } = useContractRead({
    address: paymentsContract,
    abi: abi,
    functionName: "getHistory",
    args: [address],
  });
  const history: `0x${string}`[] = data as `0x${string}`[];
  return { history, isError, error, isLoading, isSuccess };
};
