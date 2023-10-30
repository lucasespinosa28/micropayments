"use client";
import { useContractRead } from "wagmi";
import metadata from "../../abi/Invoice.json";
import { TableOnChain } from "./TableOnChain";
import { formatUnits } from "viem";
import { contract } from "./page";

export const OnChain = ({ id }: { id: string; }) => {
  const { data, isError, isLoading } = useContractRead({
    address: contract,
    abi: metadata.abi,
    functionName: "getPayments",
    args: [id],
  });
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;
  if (Array.isArray(data)) {
    let total = 0n;
    for (let index = 0; index < data.length; index++) {
      total += data[index].amount;
    }
    return (
      <div>
        <h1>Total {parseFloat(formatUnits(total, 18)).toFixed(2)}</h1>
        <TableOnChain defaultData={data} />;
      </div>
    );
  }
};
