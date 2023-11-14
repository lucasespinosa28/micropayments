import { formatUnits } from "viem";
import { useToken } from "wagmi";
import { AlertError, AlertLoading } from "./statics/alert";

export const TokenInfo = ({
  address,
  amount,
}: {
  address: `0x${string}`;
  amount: bigint;
}) => {
  const { data, isError, error, isLoading } = useToken({
    address: address,
  });

  return (
    <div>
      {isLoading && <AlertLoading />}
      {isError && error && <AlertError error={error} />}
      {data !== undefined && (
        <p className="text-center">
          {data?.symbol}:{formatUnits(amount, data?.decimals)}
        </p>
      )}
    </div>
  );
};
