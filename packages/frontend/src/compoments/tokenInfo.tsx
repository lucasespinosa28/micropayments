import { formatUnits } from "viem";
import { useToken } from "wagmi";
import { Approve} from "./approve"
export const TokenInfo = ({ address, amount }: { address: `0x${string}`,amount:bigint }) => {
  const { data, isError, isLoading } = useToken({
    address: address,
  });

  if (isLoading) return <div>Fetching token…</div>;
  if (isError) return <div>Error fetching token</div>;
  return (
    <div>
      Symbol: {data?.symbol} amount: {formatUnits(amount,data?.decimals)}
      <Approve amount={amount} />
    </div>
  );
};
