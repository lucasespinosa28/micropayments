"use client";
import { useContractRead } from "wagmi";
import metadata from "../../abi/Invoice.json";
import { Pagination } from "./Pagination";
import { contract } from "./page";

export const Invoices = ({ address }: { address: `0x${string}` | undefined; }) => {
  const { data, isError, isLoading } = useContractRead({
    address: contract,
    abi: metadata.abi,
    functionName: "getHistory",
    args: [address],
  });
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;
  if (Array.isArray(data)) {
    return <Pagination data={data} pageLimit={5} />;
  }
};
