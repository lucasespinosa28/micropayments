"use client";
import { TableOffChain } from "./tableOffChain";
import { formatUnits } from "viem";
import { useRead } from "../../hooks/useRead";
import { useEffect } from "react";

export const OffChain = ({ id }: { id: string; }) => {
  const { data, loading, error, fetchData } = useRead({ id });
  useEffect(() => {fetchData(id)},[id])
  
  if (loading) return <div>Loading...</div>;
  if (error != null) return <div>Error: {error.message}</div>;
  console.log(data)
  if (data?.success) {
    return (
      <>
        <TableOffChain total={data.total?.toFixed(2)} defaultData={data.message} />
      </>
    );
  }
};
