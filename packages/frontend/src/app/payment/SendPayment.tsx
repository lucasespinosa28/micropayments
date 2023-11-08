"use client";
import { useState } from "react";
import { Payments } from "../historic/types";
import metadata from "../../../../contract/artifacts/contracts/Invoice.sol/Invoice.json";
import { useContractWrite } from "wagmi";
import { parseUnits } from "viem";
import contract from "../../../../../packages/contract/address.json";
import { WaitForTransaction } from "./WaitForTransaction";


export function SendPayment({
  id, payments,
}: {
  id: string;
  payments: Payments[];
}) {
  const [disabled, setDisabled] = useState<boolean>(false);
  let receivers: string[] = [];
  let amounts: bigint[] = [];
  for (let index = 0; index < payments.length; index++) {
    if (parseFloat(payments[index].amount) > 0 && payments[index].quantity > 0) {
      receivers.push(payments[index].address);
      amounts.push(
        parseUnits(
          (
            parseFloat(payments[index].amount) * payments[index].quantity
          ).toString(),
          18
        )
      );
    }
  }
  const { data, isLoading, isSuccess,isError, write } = useContractWrite({
    address: contract.invoice as `0x${string}`,
    abi: metadata.abi,
    functionName: "create",
    args: [true, id, contract.token, receivers, amounts],
  });
  return (
    <div>
      <button
        className="bg-lime-500 text-white font-bold py-2 px-4 m-2 rounded w-64  shadow-md"
        id="sendTranscation"
        onClick={() => {
          setDisabled(true);
          write();
        }}
        disabled={disabled}
      >
        <span className="flex flex-row justify-center items-center">
          <span className="px-2">Pay</span>
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
              d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
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
      {isError && (
         <div className="bg-red-500 text-white font-bold py-2 px-4 m-2 rounded w-64  shadow-md">
         <div className="flex flex-col">
           <span>Error</span>
         </div>
       </div>
      )}
      {isSuccess && (
        <>
          <WaitForTransaction hash={data?.hash as `0x${string}`} />
        </>
      )}
    </div>
  );
}
