"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import {
  useAccount,
} from "wagmi";
import { OffChain } from "./OffChain";

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
