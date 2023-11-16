"use client";
import { useContractRead } from "wagmi";
import invoice from "../../../contract/artifacts/contracts/Invoice.sol/Invoice.json";
import contract from "../../../contract/address.json";

export const useGetHistory = (address: `0x${string}`) => {
  const { data, isError, isLoading, error, isSuccess } = useContractRead({
    address: "0x154b7a820f08729AEE849620aE058EF8d3CE967f",
    abi: invoice.abi,
    functionName: "getHistory",
    args: [address],
  });
  console.log({data});
  const history: `0x${string}`[] = data as `0x${string}`[];
  return { history, isError, error, isLoading, isSuccess };
};
