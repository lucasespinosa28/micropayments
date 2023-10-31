"use client";
import Link from "next/link";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { TableOffChain } from "../historic/tableOffChain";
import { useRead } from "../historic/useRead";
import { ResponseOff } from "../historic/types";
import metadata from "../../abi/Invoice.json";
import { useAccount, useContractRead, useContractWrite, useWaitForTransaction } from "wagmi";
import { parseUnits } from "viem";
import tokenMetadata from "../../../../../packages/contract/artifacts/contracts/Token.sol/Token.json"
import contract from "../../../../../packages/contract/address.json"

const Payments = ({ id,setIsPiad }: { id: string;setIsPiad:Dispatch<SetStateAction<boolean>> }) => {
  const { data, isError, isLoading } = useContractRead({
    address: contract.invoice as `0x${string}`,
    abi: metadata.abi,
    functionName: "getInvoice",
    args: [id],
  });
  if (isLoading) return <div>Loading1...</div>;
  if (isError) return <div>Error</div>;
  console.log(data);
  if(data.token === "0x0000000000000000000000000000000000000000"){
    return <div>not payed</div>
  }
  setIsPiad(true)
  return <div>payed!!!!!!!</div>
};

const Balance = ({ address }: { address: `0x${string}` | undefined; }) => {
  const { data, isError, isLoading } = useContractRead({
    address: contract.token as `0x${string}`,
    abi: tokenMetadata.abi,
    functionName: "balanceOf",
    args: [address],
  });
  if (isLoading) return <div>Loading2...</div>;
  if (isError) return <div>Error</div>;
  return <div>{data.toString()}</div>;
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
  //amounts[index] = parseUnits((quantity * amount).toString(), 18);
  let receivers: string[] = [];
  let amounts: bigint[] = [];
  for (let index = 0; index < payments.length; index++) {
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
  const { data, isLoading, isSuccess, write } = useContractWrite({
    address: contract.invoice as `0x${string}`,
    abi: metadata.abi,
    functionName: "create",
    args: [true, id, contract.token, address, address, receivers, amounts],
  });
//Transaction: {"hash":"0xfc1adb2b644226801fcd80a64df0123c0cb89a6182e855db69d4d5be64933f63"}
  return (
    <div>
      <button id="sendTranscation" onClick={() => write()}>Pay</button>
      {isLoading && <div>Check Wallet</div>}
      {isSuccess && <div>
        Transaction: {JSON.stringify(data)}
        <WaitForTransaction hash={data?.hash} />
        </div>}
    </div>
  );
}
function WaitForTransaction({hash}:{hash: `0x${string}`}) {
  const { data, isError, isLoading } = useWaitForTransaction({
    hash: hash,
  })
 
  if (isLoading) return <div>Processing…</div>
  if (isError) return <div>Transaction error</div>
  return <div>Transaction: {data.status} </div>
}
const OffChain = ({ id, address }: { id: string; address: `0x${string}` }) => {
  const { data, loading, error } = useRead({ id });
  const [isPiad,setIsPiad] = useState<boolean>(false);
  if (loading) return <div>Loading3...</div>;
  if (error != null) return <div>Error: {error.message}</div>;
  console.log(data);
  if(data?.success == false){
    return <p>invoice no find</p>
  }
  if (data?.success) {
    return (
      <>
        <h1>Total {data.total?.toFixed(2)}</h1>
        <Payments id={id} setIsPiad={setIsPiad}/>
        <TableOffChain defaultData={data.message as ResponseOff[]} />
        {!isPiad &&  <SendPayment id={id} address={address}  payments={data.message}/> }
      
      </>
    );
  }
};

export default function Home() {
  const [element, setElement] = useState<JSX.Element | null>(null); 
  const [balance, setBalance] = useState<JSX.Element | null>(null); 
  const inputRef = useRef();
  const { address, isConnecting, isDisconnected } = useAccount();
  if (isConnecting) return <div>Connecting…</div>;
  if (isDisconnected) return <div>Disconnected</div>;
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Payment</h1>
      <input id="findInput" type="text" ref={inputRef} />
      <button
        id="findButton"
        onClick={() => {
          setElement(
            <OffChain id={inputRef.current.value} address={address} />
          );
        }}
      >
        Find
      </button>
      <Link id="back" href="/">
        Back
      </Link>
      {element}
      <button
        onClick={() => {
          setBalance(
            <Balance address={address} />
          );
        }}
      >
        balance
      </button>
      {balance}
    </main>
  );
}
