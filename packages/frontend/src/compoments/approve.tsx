import { usePrepareContractWrite, useContractWrite } from "wagmi";
import token from "../../../contract/artifacts/contracts/Token.sol/Token.json";
import contract from "../../../contract/address.json";
import { WaitForTransaction } from "./WaitForTransaction";
import { Dispatch, SetStateAction, useEffect } from "react";
import { AlertError, AlertLoading } from "./alert";

export const Approve = ({
  amount,
  id,
  setApproved,
}: {
  amount: bigint;
  id: string;
  setApproved: Dispatch<SetStateAction<boolean>>;
}) => {
  const { config, error } = usePrepareContractWrite({
    address: contract.token as `0x${string}`,
    abi: token.abi,
    functionName: "approve",
    args: [contract.invoice as `0x${string}`, amount],
  });
  const { write, isSuccess, isLoading, data } = useContractWrite(config);
  useEffect(() => {
    if (isSuccess) {
      localStorage.setItem(id, "true");
      setApproved(true);
    }
  }, [id, isSuccess, setApproved]);
  return (
    <>
      <div className="flex justify-center">
        <button
          className="w-4/5 bg-blue-500 text-white border m-1 border-blue-700 font-bold py-2 px-2 rounded h-12 shadow-md"
          disabled={!write}
          onClick={() => write?.()}
        >
          Approve
        </button>
      </div>
      {isSuccess && data && <WaitForTransaction hash={data.hash} />}
      {isLoading && <AlertLoading />}
      {error && <AlertError error={error} />}
    </>
  );
};
