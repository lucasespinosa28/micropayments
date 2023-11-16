"use client";
import { useContractRead } from "wagmi";
import { abi } from "../Invoice.json";

export const useGetHistory = (address: `0x${string}`) => {
  const { data, isError, isLoading, error, isSuccess } = useContractRead({
    address: "0x154b7a820f08729AEE849620aE058EF8d3CE967f",
    abi: abi,
    functionName: "getHistory",
    args: [address],
  });
  console.log({data});
  const history: `0x${string}`[] = data as `0x${string}`[];
  return { history, isError, error, isLoading, isSuccess };
};
