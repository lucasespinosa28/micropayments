"use client";
import { useWaitForTransaction } from "wagmi";
import { shortAddress } from "../historic/shortAddress";

export function WaitForTransaction({ hash }: { hash: `0x${string}`; }) {
  const { data, isError, isLoading } = useWaitForTransaction({
    hash: hash,
  });

  if (isLoading)
    return (
      <div className="bg-blue-500 text-white font-bold py-2 px-4 m-2 rounded w-64  shadow-md">
        <div className="flex flex-col">
          <span>Loading...</span>
        </div>
      </div>
    );
  if (isError)
    return (
      <div className="bg-red-500 text-black font-bold py-2 px-4 m-2 rounded w-64  shadow-md">
        <div className="flex flex-col">
          <span>Error</span>
        </div>
      </div>
    );
  return (
    <div className="bg-lime-500 text-white font-bold py-2 px-4 m-2 rounded w-64  shadow-md">
      <div className="flex flex-col">
        <span>Transaction: {data.status}</span>
        <span>Hash: {shortAddress(hash)}</span>
      </div>
    </div>
  );
}
