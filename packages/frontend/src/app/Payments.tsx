"use client";
import { useGetPayments } from "@/hooks/useGetPayments";
import { Table } from "./Table";
import { AlertError, AlertLoading } from "@/compoments/alert";

export function Payments({
  id,
  address,
}: {
  id: `0x${string}`;
  address: `0x${string}`;
}) {
  //console.log(id);
  const { payments, error, isLoading, isSuccess } = useGetPayments(id);
  return (
    <>
      {isLoading && <AlertLoading />}
      {error && <AlertError error={error} />}
      {isSuccess && <Table id={id} payments={payments} address={address} />}
    </>
  );
}
