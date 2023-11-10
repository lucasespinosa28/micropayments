"use client";
import { useContractRead } from "wagmi";
import invoice from "../../../contract/artifacts/contracts/Invoice.sol/Invoice.json";
import contract from "../../../contract/address.json"
import { Payment } from "./Payment";

export const useGetPayments = (id: `0x${string}`) => {
  const { data, isError, isLoading,error,isSuccess } = useContractRead({
    address: contract.invoice as `0x${string}`,
    abi: invoice.abi,
    functionName: "getPayments",
    args: [id],
  });
  const payments:Payment[] = data as Payment[]
  return {payments,isError,error,isLoading,isSuccess}
};
