"use client";
import { Update } from "@/app/invoice/update";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useAccount } from "wagmi";
import { Invoices } from "./historic/Invoices";
import contract from "../../../../packages/contract/address.json";
import { Balance } from "./payment/Balance";
export default function Home() {
  const { address, isConnecting, isDisconnected } = useAccount();
  if (isConnecting) return <div>Connecting…</div>;
  if (isDisconnected) return <div>Disconnected</div>;
  let message = "production";
  const env = process.env.NODE_ENV;
  if (env == "development") {
    message = "dev";
  }
  return (
    <main className="flex min-h-screen flex-col items-center">
      <div className="w-full p-4 text-left">
        <h1 className="font-medium">
          Welcome to the Microinvoice, create payments and transfer them to
          dozens of accounts at the same time
        </h1>
      </div>
      <div className="w-full p-4 text-left">
        <h1 className="font-medium">
          1-Create a list of who will receive payments and create an ID for third
          parties to pay or you
        </h1>
      </div>
      <Link id="invoice" href="/invoice">
        <button className="bg-lime-500 text-white font-bold py-2 px-4 m-2 rounded w-64  shadow-md">
          <span className="flex flex-row justify-center items-center">
            <span className="px-2">Create payment list</span>
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
      </Link>
      <div className="w-full p-4 text-left">
        <h1 className="font-medium">
          2-Pay the payment list using the id that was generated
        </h1>
      </div>
      <Link id="payment" href="/payment">
      <button className="bg-lime-500 text-white font-bold py-2 px-4 m-2 rounded w-64  shadow-md">
          <span className="flex flex-row justify-center items-center">
            <span className="px-2">Pay using ID</span>
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
      </Link>
      <div className="w-full overflow-x-auto">
        <Invoices address={address} />
      </div>
    </main>
  );
}
