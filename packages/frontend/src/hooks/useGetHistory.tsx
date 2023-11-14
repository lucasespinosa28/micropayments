"use client";
import { useContractRead } from "wagmi";
import invoice from "../../../contract/artifacts/contracts/Invoice.sol/Invoice.json";
import contract from "../../../contract/address.json";

export const useGetHistory = (address: `0x${string}`) => {
  const { data, isError, isLoading, error, isSuccess } = useContractRead({
    address: contract.invoice as `0x${string}`,
    abi: invoice.abi,
    functionName: "getHistory",
    args: [address],
  });
  const history: `0x${string}`[] = data as `0x${string}`[];
  return { history, isError, error, isLoading, isSuccess };
};
