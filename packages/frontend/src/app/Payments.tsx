"use client";
import { useGetPayments } from "@/hooks/useGetPayments";
import { AlertError, AlertLoading } from "@/compoments/statics/alert";
import { hexToString } from "viem";
import { Table } from "./table";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Payment } from "@/hooks/Payment";
import { Approve } from "@/compoments/web3/approve";
import { SendAllPayment } from "@/compoments/web3/sendPaymentAll";

type Filter = {
  index: bigint;
  unlock: boolean;
};

export function Payments({
  id,
  address,
}: {
  id: `0x${string}`;
  address: `0x${string}`;
}) {
  console.log({id,address});
  const { payments, error, isLoading, isSuccess } = useGetPayments(id);
  const [all, setAll] = useState<boolean>();
  const total = useRef<bigint>(0n);
  const islocked = useRef<bigint[]>();
  const idString = hexToString(id, { size: 32 });
  useEffect(() => {
    if (payments) {
      islocked.current = payments
        .map((item, index) => {
          return {
            index: BigInt(index),
            unlock:
              item.dateTime > Math.floor(Date.now() / 1000) ? false : true,
          };
        })
        .filter((item: Filter) => item.unlock)
        .map((item) => item.index);
      total.current = payments.reduce(
        (total: bigint, num: Payment) => total + num.amount,
        0n,
      );

      setAll(
        payments.every(
          (value: Payment, index: number, array: Payment[]) =>
            value.token === array[index].token,
        ),
      );
    }
  }, [payments]);
  return (
    <>
      {isLoading && (
        <AlertLoading>
          <>Loading...</>
        </AlertLoading>
      )}
      {error && <AlertError error={error} />}
      {isSuccess && (
        <>
          {total && payments.length > 0 &&(
            <div className="flex flex-col m-4">
              <Approve
                label="Approve All"
                token={payments[0].token}
                id={id}
                amount={total.current}
              />
              {islocked.current && all && (
                <SendAllPayment id={id} index={islocked.current} />
              )}
            </div>
          )}
          <Link
            className="flex justify-center font-bold mt-2 text-2xl text-center drop-shadow-md"
            id="invoice"
            href={`/qrcode/${idString}`}
          >
            <h2> {idString}</h2>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 m-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z"
              />
            </svg>
          </Link>
          {isSuccess &&
            payments &&
            payments.map((payment, index) => {
              return (
                <Table
                  key={id + index}
                  id={id}
                  payment={payment}
                  index={index}
                  address={address}
                />
              );
            })}
        </>
      )}
    </>
  );
}
