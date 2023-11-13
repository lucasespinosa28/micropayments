"use client";
import { nanoid } from "nanoid";
import React, { BaseSyntheticEvent, useEffect, useRef, useState } from "react";
import { InputCreator } from "./InputCreator";
import { ImportFile } from "./importFile";
import { InputValues } from "./InputValues";
import { SelectToken } from "./selectToken";
import contract from "../../../../../packages/contract/address.json";
import { useAccount } from "wagmi";
import { WriteCreate } from "./createPayment";
import CopyToClipboard from "react-copy-to-clipboard";
import { id_ID } from "@faker-js/faker";
import { QRCodeSVG } from "qrcode.react";
import Link from "next/link";
const inputCss = "border border-gray-300 text-lg";

export default function Home() {
  const { address } = useAccount();
  
  const [data, setData] = useState<InputValues[]>([]);
  const [args, setArgs] = useState<any[]>([]);
  const tokenRef = useRef<`0x${string}`>(contract.token as `0x${string}`);
  const [id, setId] = useState<string>("");
  const [isAction, setAction] = useState<number>(0);
  const [json, setJson] = useState<string>();
  function handleRef() {
    const payments = data.map((item) => ({ ...item, token: tokenRef.current }));
    setArgs(payments);
    setJson(JSON.stringify(payments));
  }

  return (
    <main className="flex min-h-screen flex-col items-center">
      <h1>Create</h1>
      <SelectToken tokenRef={tokenRef} />
      {isAction == 0 && <ImportFile setData={setData} setAction={setAction} />}
      {isAction == 0 && (
        <button id="newList" onClick={() => setAction(2)}>
          Create a new payment list
        </button>
      )}
      {isAction == 1 && address != undefined && (
        <InputCreator setData={setData} address={address} inputValues={data} />
      )}
      {isAction == 2 && address != undefined && (
        <InputCreator setData={setData} address={address} inputValues={[]} />
      )}
      <button id="current" onClick={handleRef}>current</button>
      {json && <WriteCreate setId={setId} inputValues={args} />}
      {id.length > 0 && (
        <div>
           <hr />
           <h3>{id}</h3>
           <p>Hello world</p>
          <CopyToClipboard text={id}>
            <button>Copy</button>
          </CopyToClipboard>
          <hr />
          <QRCodeSVG
            size={window.innerWidth - window.innerWidth * 0.1}
            value={id}
          />
          <hr />
          <Link id="payId" href={"/create/"+id}>
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
        </div>
        
      )}
    </main>
  );
}
