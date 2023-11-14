"use client";
import { useEffect, useState } from "react";
import { Payment } from "../hooks/Payment";
import { TokenInfo } from "../compoments/tokenInfo";
import { SendPayment } from "../compoments/web3/sendPayment";
import { shortAddress } from "../compoments/shortAddress";
import { Approve } from "@/compoments/web3/approve";
import { Confirm } from "@/compoments/web3/confirm";
import { Cancel } from "@/compoments/web3/cancel";
import { StatusIcon } from "./StatusIcon";
import Countdown from "react-countdown";
import { ButtonWarning } from "../compoments/inputs/buttons";

export const Table = ({
  payment,
  id,
  index,
  address,
}: {
  address: `0x${string}`;
  payment: Payment;
  id: `0x${string}`;
  index: number;
}) => {
  const [islock, setLock] = useState<boolean>(false);
  const isReceiver = payment.receiver === address ? true : false;
  const [status, setStatus] = useState<bigint>(payment.status);
  const date = new Date(
    parseInt(payment.dateTime.toString()) * 1000
  ).toLocaleString();
  const paymentDate = parseInt(payment.dateTime.toString());
  useEffect(() => {
    setLock(paymentDate > Math.floor(Date.now() / 1000) && true);
  }, [paymentDate]);

  return (
    <div
      key={`${index}-${payment.receiver}`}
      className="flex flex-col border my-4 shadow-md w-full text-center  text-xl"
    >
      <div className="flex justify-between">
        <p className="text-center text-sm">{date}</p>
        <StatusIcon status={islock ? "4" : status.toString()} />
      </div>

      <p className="font-bold">Payer</p>
      <p>{shortAddress(payment.payer, 8)}</p>
      <div className="flex justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path
            fillRule="evenodd"
            d="M10 5a.75.75 0 01.75.75v6.638l1.96-2.158a.75.75 0 111.08 1.04l-3.25 3.5a.75.75 0 01-1.08 0l-3.25-3.5a.75.75 0 111.08-1.04l1.96 2.158V5.75A.75.75 0 0110 5z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <div>
        <TokenInfo amount={payment.amount} address={payment.token} />
      </div>
      <div className="flex justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path
            fillRule="evenodd"
            d="M10 5a.75.75 0 01.75.75v6.638l1.96-2.158a.75.75 0 111.08 1.04l-3.25 3.5a.75.75 0 01-1.08 0l-3.25-3.5a.75.75 0 111.08-1.04l1.96 2.158V5.75A.75.75 0 0110 5z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <p className="font-bold">Receiver</p>
      <p>{shortAddress(payment.receiver, 8)}</p>
      <div className="flex flex-col m-4">
        {(status == 0n || localStorage.getItem(id + index) != "true") && (
          <Approve
            setStatus={setStatus}
            id={id + index}
            amount={payment.amount}
          />
        )}
        {status == 0n && localStorage.getItem(id + index) == "true" && (
          <SendPayment id={id} index={index} setStatus={setStatus} />
        )}
        {status == 1n && !islock && (
          <Confirm
            isReceiver={isReceiver}
            id={id}
            index={index}
            setStatus={setStatus}
          />
        )}
        {islock && (
          <ButtonWarning id={"count" + index}>
            <span className="flex flex-row justify-center items-center">
              <Countdown
                date={
                  Date.now() +
                  (paymentDate - Math.floor(Date.now() / 1000)) * 1000
                }
              />
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
                  d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                />
              </svg>
            </span>
          </ButtonWarning>
        )}
        {(status == 0n || status == 1n) && (
          <Cancel id={id} index={index} setStatus={setStatus} />
        )}
      </div>
    </div>
  );
};
