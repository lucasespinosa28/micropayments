"use client";
import React, { useRef, useState } from "react";
import { InputCreator } from "./InputCreator";
import { InputValues } from "./InputValues";
import { SelectToken } from "../../compoments/inputs/selectToken";
import { useAccount } from "wagmi";
import { WriteCreate } from "../../compoments/web3/createPayment";
import CopyToClipboard from "react-copy-to-clipboard";
import { QRCodeSVG } from "qrcode.react";
import Link from "next/link";
import {tokens} from "../../compoments/web3/tokens";
import { Menu } from "../../compoments/statics/menu";

export default function Home() {
  const { address } = useAccount();
  const [data, setData] = useState<InputValues[]>([]);
  const tokenRef = useRef<`0x${string}`>(tokens().address[0]);
  const [id, setId] = useState<string>("");

  return (
    <main className="flex flex-col items-center">
      <Menu />
      <SelectToken tokenRef={tokenRef} />
      {address && <InputCreator setData={setData} address={address} />}
      {data.length > 0 && (
        <WriteCreate
          setId={setId}
          tokenAddress={tokenRef.current}
          data={data}
        />
      )}
      {id.length > 0 && (
        <div>
          <div className="font-bold flex justify-between w-full">
            <h3 className="ml-1">Id: {id}</h3>
            <CopyToClipboard text={id}>
              <button className="mr-1 flex flex-row">
                <span className="underline ">Copy</span>
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
                    d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
                  />
                </svg>
              </button>
            </CopyToClipboard>
          </div>
          <Link id="payId" href={"/create/" + id}>
            <div className="flex justify-center ">
              <button className="bg-sky-500 text-white font-bold py-2 px-4 m-2 rounded shadow-md">
                Deposit tokens to payments
              </button>
            </div>
          </Link>
          <QRCodeSVG
            className="mt-2 mb-24"
            size={window.innerWidth - window.innerWidth * 0.1}
            value={id}
          />
        </div>
      )}
    </main>
  );
}
