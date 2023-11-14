"use client";
import { useGetHistory } from "@/hooks/useGetHistory";
import { Pagination } from "./Pagination";
import { AlertLoading, AlertError } from "../compoments/statics/alert";

export function History({ address }: { address: `0x${string}` }) {
  const { history, isError, error, isLoading, isSuccess } =
    useGetHistory(address);
  return (
    <>
      {isLoading && (
        <AlertLoading>
          <>loading</>
        </AlertLoading>
      )}
      {isError && error && <AlertError error={error} />}
      {isSuccess && (
        <Pagination data={history.reverse()} address={address} pageLimit={1} />
      )}
    </>
  );
}
