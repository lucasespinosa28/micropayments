"use client";
import { useState } from "react";
import { Payment } from "../hooks/Payment";
import { TokenInfo } from "../compoments/tokenInfo";
import { SendPayment } from "../compoments/sendPayment";
import { shortAddress } from "../compoments/shortAddress";
import { Approve } from "@/compoments/approve";
import { Confirm } from "@/compoments/confirm";
import { Cancel } from "@/compoments/cancel";

export const Row = ({
  payment,
  id,
  index,
}: {
  payment: Payment;
  id: `0x${string}`;
  index: number;
}) => {
  const [isApproved, setApproved] = useState<boolean>(false);
  const date = new Date(
    parseInt(payment.dateTime.toString()) * 1000
  ).toLocaleString();
  const status = parseInt(payment.status.toString());
  return (
    <div
      key={`${index}-${payment.receiver}`}
      className="border divide-y my-4 shadow-md w-full"
    >
      <div className="flex justify-between">
        <div>#{index + 1}</div>
        <div>status:{status}</div>
      </div>
      <div className="flex justify-between">
        <div>Payer:</div>
        <div>{shortAddress(payment.payer)}</div>
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
      <div className="flex justify-between">
        <div>Receiver:</div>
        <div>{shortAddress(payment.receiver)}</div>
      </div>
      {status < 2 && (
        <div>
          {status == 0 ? (
            <div>
              {localStorage.getItem(id + index) || isApproved ? (
                <SendPayment id={id} index={index} />
              ) : (
                <Approve
                  id={id + index}
                  setApproved={setApproved}
                  amount={payment.amount}
                />
              )}
            </div>
          ) : (
            <div>
               <Confirm id={id} index={index} />
            </div>
          )}
         
          {/* <SendPayment id={id} index={index} />
          <Approve
            id={id + index}
            setApproved={setApproved}
            amount={payment.amount}
          /> */}
          <Cancel id={id} index={index} />
        </div>
      )}

      <p className="text-center">{date}</p>
    </div>
  );
};
