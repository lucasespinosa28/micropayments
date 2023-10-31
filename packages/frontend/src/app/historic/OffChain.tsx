"use client";
import { TableOffChain } from "./tableOffChain";
import { ResponseOff } from "./types";
import { useRead } from "./useRead";

export const OffChain = ({ id }: { id: string; }) => {
  const { data, loading, error } = useRead({ id });
  if (loading) return <div>Loading...</div>;
  if (error != null) return <div>Error: {error.message}</div>;
  if (data?.success) {
    return (
      <>
        <h1>Total {data.total?.toFixed(2)}</h1>
        <TableOffChain defaultData={data.message as ResponseOff} />
      </>
    );
  }
};
