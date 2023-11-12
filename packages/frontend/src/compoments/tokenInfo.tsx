import { formatUnits } from "viem";
import { useToken } from "wagmi";
import { Approve } from "./approve";
import { MutableRefObject, useEffect } from "react";
export const TokenInfo = ({
  address,
  amount,
}: {
  address: `0x${string}`;
  amount: bigint;
}) => {
  const { data, isError, isLoading,isFetched } = useToken({
    address: address,
  });

  if (isLoading) return <div>Fetching token…</div>;
  if (isError) return <div>Error fetching token</div>;
  return (
    <div>
      {isLoading && <div>Fetching token…</div>}
      {isError && <div>Error fetching token</div>}
      {data !== undefined && <p className="text-center"> {data?.symbol}:{formatUnits(amount, data?.decimals)}</p>}
    </div>
  );
};
