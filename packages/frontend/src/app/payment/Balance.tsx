"use client";
import { useContractRead } from "wagmi";
import { formatUnits } from "viem";
import tokenMetadata from "../../../../../packages/contract/artifacts/contracts/Token.sol/Token.json";

export const Balance = ({
  address, contract,
}: {
  address: `0x${string}`;
  contract: `0x${string}`;
}) => {
  const { data, isError, isLoading } = useContractRead({
    address: contract,
    abi: tokenMetadata.abi,
    functionName: "balanceOf",
    args: [address],
  });
  if (isError) return <div>Error</div>;
  if (isLoading) return <div>Loading</div>;
  return (
    <div className="bg-slate-600 text-slate-50 flex flex-col w-screen text-center font-bold">
      <span>Token</span>
      <span>{contract} </span>
      <span>Balance</span>
      <span>{parseFloat(formatUnits(data, 18)).toFixed(2)}</span>
    </div>
  );
};
