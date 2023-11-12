"use client";
import { Update } from "@/app/invoice/update";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useAccount } from "wagmi";
import { useGetHistory } from "@/hooks/useGetHistory";
import { useGetPayments } from "@/hooks/useGetPayments";
import { Payment } from "../hooks/Payment";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { TokenInfo } from "../compoments/tokenInfo";
import { Allowance } from "../compoments/Allowance"
import { SendPayment } from "../compoments/sendPayment"
import { Confirm } from "../compoments/confirm";
import { Cancel } from "../compoments/cancel";

function History({ address }: { address: `0x${string}` }) {
  const { history, isError, error, isLoading, isSuccess } =
    useGetHistory(address);
  if (isLoading) {
    return <div>loading</div>;
  }
  if (isError) {
    return <div>{JSON.stringify(error)}</div>;
  }
  if (isSuccess) {
    return (
      <div>
        <Pagination data={history} pageLimit={1}/>
        {/* {history.map((id, index) => (
          <Payments key={`${id}-${index}`} id={id} />
        ))} */}
      </div>
    );
  }
}

const Pagination = ({
  data,
  pageLimit,
}: {
  data: `0x${string}`[];
  pageLimit: number;
}) => {
  const [parent] = useAutoAnimate(/* optional config */);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / pageLimit);
  const currentData = data.slice(
    (currentPage - 1) * pageLimit,
    currentPage * pageLimit
  );

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentPage(Number(event.target.value));
  };

  let options = Array.from({ length: totalPages }, (_, index) => index + 1).map(
    (item, index) => (
      <option key={`${item}-${index}`} value={item}>
        {item}
      </option>
    )
  );
  const Buttons = () => {
    return (
      <div className="flex justify-center items-center">
        <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
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
              d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5"
            />
          </svg>
        </button>
        <button
          onClick={() => setCurrentPage((prev) => prev - 1)}
          disabled={currentPage === 1}
        >
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
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </button>
        <select value={currentPage} onChange={handleChange}>
          {options}
        </select>
        <button
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={currentPage === totalPages}
        >
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
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
        <button
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages}
        >
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
              d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
      </div>
    );
  };
  if (data.length > 0) {
    return (
      <div>
        <Buttons />
        <div ref={parent}>
          {currentData.map((item,index) => (
            <Payments key={`item-${item}`} id={item} />
          ))}
        </div>
        <Buttons />
      </div>
    );
  }
  return <></>;
}
function Payments({ id }: { id: `0x${string}` }) {
  const { payments, isError, error, isLoading, isSuccess } = useGetPayments(id);
  if (isLoading) {
    return <div>loading</div>;
  }
  if (isError) {
    return <div>{JSON.stringify(error)}</div>;
  }
  if (isSuccess) {
    return (
      <div>
        <Table id={id} payments={payments} />
      </div>
    );
  }
}

function Table({ payments,id }: { payments: Payment[],id :`0x${string}`}) {
  const { address } = useAccount();
  const data = payments.map((payment, index) => {
    const date =  new Date(parseInt(payment.dateTime.toString())*1000).toLocaleString();
    return (
      <ul key={`${index}-${payment.receiver}`}>
        <li>index:{index+1}</li>
        <li>dateTime:{date}</li>
        <li>token:{payment.token}</li>
        <li><TokenInfo amount={payment.amount} address={payment.token} /></li>
        <li><Allowance address={address as `0x${string}`} contract={payment.token} /></li>
        <li><SendPayment id={id} index={index} /></li>
        <li><Confirm id={id} index={index}/> </li>
        <li><Cancel id={id} index={index}/> </li>
        <li>amount:{payment.amount.toString()}</li>
        <li>payer:{payment.payer}</li>
        <li>receiver:{payment.receiver}</li>
        <li>status:{payment.status.toString()}</li>
        <hr />
      </ul>
    );
  });
  return <div>{data}</div>;
}

export default function Home() {
  const { address, isConnecting, isDisconnected, isConnected } = useAccount();
  let message = "production";
  const env = process.env.NODE_ENV;
  if (env == "development") {
    message = "dev";
  }
  return (
    <main className="flex min-h-screen flex-col items-center">
      {isConnecting && (
        <div>
          <h1>Connecting…</h1>
        </div>
      )}
      {isDisconnected && (
        <div>
          <h1>Disconnected</h1>
        </div>
      )}
           <h2>payment history</h2>
      {(isConnected && address) && 
      <div>
          <Link id="invoice" href="/create">
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
        <History address={address} />
        </div>
        }
      <>
        {/* <div className="w-full p-4 text-left">
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
      </div> */}
      </>
    </main>
  );
}
