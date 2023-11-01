"use client";
import Link from "next/link";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { TableOffChain } from "../historic/tableOffChain";
import { useRead } from "../../hooks/useRead";
import { ResponseOff } from "../historic/types";
import metadata from "../../abi/Invoice.json";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { formatUnits, parseUnits } from "viem";
import tokenMetadata from "../../../../../packages/contract/artifacts/contracts/Token.sol/Token.json";
import contract from "../../../../../packages/contract/address.json";
import { AlertInfo, AlertSuccess } from "@/compoments/alert";
import { shortAddress } from "../historic/shortAddress";

const Payments = ({
  id,
  setIsPiad,
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
  if (isLoading)  return <div>Loading...</div>;
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

const Balance = ({
  address,
  contract,
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

function SendPayment({
  id,
  address,
  payments,
}: {
  id: string;
  address: string;
  payments: ResponseOff[];
}) {
  const [disabled, setDisabled] = useState<boolean>(false);
  let receivers: string[] = [];
  let amounts: bigint[] = [];
  for (let index = 0; index < payments.length; index++) {
    if (payments[index].amount > 0 && payments[index].quantity > 0) {
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
  const { data, isLoading, isSuccess, write } = useContractWrite({
    address: contract.invoice as `0x${string}`,
    abi: metadata.abi,
    functionName: "create",
    args: [true, id, contract.token, address, address, receivers, amounts],
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
              d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
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
function WaitForTransaction({ hash }: { hash: `0x${string}` }) {
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
const OffChain = ({ id, address }: { id: string; address: `0x${string}` }) => {
  const { data, loading, error,fetchData } = useRead({ id });
  useEffect(() => {fetchData(id)},[id])
  const [isPiad, setIsPiad] = useState<boolean>(false);
  if (loading) return <div>Loading3...</div>;
  if (error != null) return <div>Error: {error.message}</div>;
  if (data?.success == false) {
    return (
      <div className="bg-red-500 text-white font-bold py-2 px-4 m-2 rounded w-64  shadow-md">
        <div className="flex flex-col">
          <span>Invoice not found</span>
        </div>
      </div>
    );
  }
  if (data != null && data?.success) {
    return (
      <>
        <Payments id={id} setIsPiad={setIsPiad} />
        <Balance address={address} contract={data.message.token} />
        <div className="bg-red-900 overflow-x-auto w-full">
          <TableOffChain total={data.total} defaultData={data.message as ResponseOff[]} />
        </div>
        <div>
          {!isPiad && (
            <SendPayment
              id={id}
              address={address}
              payments={data.message.token}
            />
          )}
        </div>
      </>
    );
  }
};

export default function Home() {
  const [count, setCount] = useState(0);
  const inputRef = useRef();
  const { address, isConnecting, isDisconnected } = useAccount();
  if (isConnecting) return <div>Connecting…</div>;
  if (isDisconnected) return <div>Disconnected</div>;
  return (
    <main className="flex min-h-screen flex-col items-center">
      <Link id="back" href="/">
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
            d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75"
          />
        </svg>
      </Link>
      <div className="flex w-full flex-row p-4 drop-shadow-md border rounded">
        <input
          className="border rounded-l p-2 w-full"
          id="findInput"
          type="text"
          ref={inputRef}
        />
        <button
          id="findButton"
          className="bg-slate-600 text-slate-50 border  border-slate-600  rounded-r flex justify-center items-center text-wihite px-4"
          onClick={() => {
            setCount(count + 1);
          }}
        >
          <span>Find</span>
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
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </button>
      </div>

      {count > 0 && <OffChain id={inputRef.current.value} address={address} />}
    </main>
  );
}
