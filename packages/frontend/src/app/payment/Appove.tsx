"use client";
import { useContractWrite } from "wagmi";
import { parseUnits } from "viem";
import tokenMetadata from "../../../../../packages/contract/artifacts/contracts/Token.sol/Token.json";
import contract from "../../../../../packages/contract/address.json";
import { WaitForTransaction } from "./WaitForTransaction";
import { useState } from "react";

export function Appove({ amount }: { amount: number }) {
  const [disabled, setDisabled] = useState<boolean>(false);
  const { data, isLoading, isSuccess, write } = useContractWrite({
    address: contract.token as `0x${string}`,
    abi: tokenMetadata.abi,
    functionName: "approve",
    args: [
      contract.invoice as `0x${string}`,
      parseUnits("1000000000000000000000000", 18),
    ],
  });

  return (
    <div>
      <button
        className="bg-lime-500 text-white font-bold py-2 px-4 m-2 rounded w-64  shadow-md"
        id="Appove"
        onClick={() => {
          setDisabled(true);
          write();
        }}
        disabled={disabled}
      >
        <span className="flex flex-row justify-center items-center">
          <span className="px-2">Approve</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
            />
          </svg>
        </span>
      </button>
      {isLoading && (
        <div className="bg-blue-500 text-white font-bold py-2 px-4 m-2 rounded w-64  shadow-md">
          <div className="flex flex-col">
            <span>Check you wallet...</span>
          </div>
        </div>
      )}
      {isSuccess && (
        <>
          <WaitForTransaction hash={data?.hash} />
        </>
      )}
    </div>
  );
}
