"use client";
//import { nanoid } from "nanoid";
import React, { BaseSyntheticEvent, useEffect, useRef, useState } from "react";
import { InputCreator } from "./InputCreator";
import { ImportFile } from "./importFile";
import { InputValues } from "./InputValues";
import { SelectToken } from "./selectToken";
import contract from "../../../../../packages/contract/address.json";
import { useAccount } from "wagmi";
const inputCss = "border border-gray-300 text-lg";

export default function Home() {
  const { address } = useAccount();
  const [data, setData] = useState<InputValues[]>([]);
  const tokenRef = useRef<`0x${string}`>(contract.token as `0x${string}`);
  const paymentRef = useRef<InputValues[]>([]);
  const [isAction, setAction] = useState<number>(0);
 
  function handleRef() {
    const payments = paymentRef.current.map((item) => ({...item,token:tokenRef.current}));
    console.log(payments);
    
  }

  return (
    <main className="flex min-h-screen flex-col items-center">
      <h1>Create</h1>
      <SelectToken tokenRef={tokenRef}/>
      {isAction == 0 && <ImportFile setData={setData} setAction={setAction} />}
      {isAction == 0 && (
        <button onClick={() => setAction(2)}>Create a new payment list</button>
      )}
      {(isAction == 1 && address != undefined) && <InputCreator address={address} paymentRef={paymentRef} inputValues={data} />}
      {(isAction == 2 && address != undefined) && <InputCreator address={address} paymentRef={paymentRef} inputValues={[]} />}
      <button onClick={handleRef}>current</button>
    </main>
  );
}
