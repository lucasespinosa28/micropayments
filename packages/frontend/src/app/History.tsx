"use client";
import { useGetHistory } from "@/hooks/useGetHistory";
import { Pagination } from "./Pagination";

export function History({ address }: { address: `0x${string}`; }) {
  const { history, isError, error, isLoading, isSuccess } = useGetHistory(address);
  if (isLoading) {
    return <div>loading</div>;
  }
  if (isError) {
    return <div>{JSON.stringify(error)}</div>;
  }
  if (isSuccess) {
    return <Pagination data={history} address={address} pageLimit={1} />;
  }
}
