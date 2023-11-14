"use client";
import { useWaitForTransaction } from "wagmi";
import { AlertError, AlertLoading } from "../statics/alert";
import { AlertTranscation } from "../statics/alert";

export function WaitForTransaction({ hash }: { hash: `0x${string}` }) {
  const { data, isError, error, isLoading, isSuccess } = useWaitForTransaction({
    hash: hash,
  });
  return (
    <div>
      {isLoading && (
        <AlertLoading>
          <>Loading...</>
        </AlertLoading>
      )}
      {isError && error != null && <AlertError error={error} />}
      {isSuccess && data && (
        <AlertTranscation status={data.status} hash={hash} />
      )}
    </div>
  );
}
