"use client";
import { useWaitForTransaction } from "wagmi";
import { shortAddress } from "./shortAddress";
import { AlertError, AlertLoading } from "./alert";
import { useState } from "react";

export function WaitForTransaction({ hash }: { hash: `0x${string}` }) {
  const { data, isError, error, isLoading, isSuccess } = useWaitForTransaction({
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
    <div>
      {isLoading && <AlertLoading />}
      {isError && error != null && <AlertError error={error} />}
      {isSuccess && data && (
        <AlertTranscation status={data.status} hash={hash} />
        // <div className="bg-lime-500 text-white font-bold py-2 px-4 m-2 rounded w-64  shadow-md">
        //   <div className="flex flex-col">
        //     <span>Transaction: {data.status}</span>
        //     <span>Hash: {shortAddress(hash)}</span>
        //   </div>
        // </div>
      )}
    </div>
  );
}

const AlertTranscation = ({
  status,
  hash,
}: {
  status: "success" | "reverted";
  hash: `0x${string}`;
}) => {
  const color = status === "success" ?"bg-lime-500":"bg-red-500";
  const [display, setDisplay] = useState<boolean>(true);
  return (
    <>
      {display ? (
        <div className={`${color} text-white m-3 p-1 rounded shadow-2xl`}>
          <div className="flex justify-between m-1">
            <a
              href={`https://explorer.celo.org/mainnet/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="flex flex-row items-center">
                <p className="font-bold text-lg">{status}:</p>
                <p className="text-sm">{shortAddress(hash, 8)}</p>
              </div>
            </a>

            <svg
              onClick={() => setDisplay(false)}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="mr-2 w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};
