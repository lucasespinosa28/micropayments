"use client";
import { Payment } from "../hooks/Payment";
import { hexToString } from "viem";
import { Row } from "./Row";

export function Table({
  payments, id, address,
}: {
  payments: Payment[];
  id: `0x${string}`;
  address: `0x${string}`;
}) {
  const row = payments.map((payment, index) => {
    return (
      <Row
        key={id + index}
        id={id}
        payment={payment}
        index={index}
        address={address} />
    );
  });
  return (
    <>
      <h2 className="font-bold text-2xl text-center drop-shadow-md">ID:{hexToString(id, { size: 32 })}</h2>
      <>{row}</>;
    </>
  );
}
