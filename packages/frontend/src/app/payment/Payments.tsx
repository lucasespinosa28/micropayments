"use client";
import { Dispatch, SetStateAction } from "react";
import metadata from "../../abi/Invoice.json";
import { useContractRead } from "wagmi";
import contract from "../../../../../packages/contract/address.json";


export const Payments = ({
  id, setIsPiad,
}: {
  id: string;
  setIsPiad: Dispatch<SetStateAction<boolean>>;
}) => {

  const { data, isError, isLoading } = useContractRead({
    address: contract.invoice as `0x${string}`,
    abi: metadata.abi,
    functionName: "getInvoice",
    args: [id],
  });
  if (isError) return <div>Error</div>;
  if (isLoading) return <div>Loading...</div>;
  if (data.token === "0x0000000000000000000000000000000000000000") {
    return (
      <div className="bg-blue-500 text-white font-bold py-2 px-4 m-2 rounded w-64  shadow-md">
        <div className="flex flex-col">not paid!</div>
      </div>
    );
  }
  setIsPiad(true);
  return (
    <div className="bg-lime-500 text-white font-bold py-2 px-4 m-2 rounded   shadow-md">
      <div className="flex flex-col">Paid!</div>
    </div>
  );
};
