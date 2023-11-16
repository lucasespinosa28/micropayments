import { formatUnits } from "viem";
import { useToken } from "wagmi";
import { AlertError, AlertLoading } from "../statics/alert";
import { Dispatch, SetStateAction, useEffect } from "react";

export const TokenInfo = ({
  address,
  amount,
  setDecimals,
}: {
  address: `0x${string}`;
  amount: bigint;
  setDecimals:Dispatch<SetStateAction<number|undefined>>;
}) => {
  const { data, isError, error, isLoading } = useToken({
    address: address,
    onSuccess(){
     
    }
  });
  useEffect(() => {
    if(data){
      setDecimals(data.decimals);
    }
  },[data]);
  return (
    <div>
      {isLoading && (
        <AlertLoading>
          <>Loading...</>
        </AlertLoading>
      )}
      {isError && error && <AlertError error={error} />}
      {data !== undefined && (
        <p className="text-center">
          {data?.symbol}:{formatUnits(amount, data?.decimals)}
        </p>
      )}
    </div>
  );
};
