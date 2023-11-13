"use client";
import { shortAddress } from "./shortAddress";
import { useState } from "react";

export const AlertTranscation = ({
  status, hash,
}: {
  status: "success" | "reverted";
  hash: `0x${string}`;
}) => {
  const color = status === "success" ? "bg-lime-500" : "bg-red-500";
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
                d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};
