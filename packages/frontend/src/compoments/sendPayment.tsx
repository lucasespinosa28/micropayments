import { useContractWrite } from "wagmi";
import { AlertError, AlertLoading } from "./alert";
import invoice from "../../../contract/artifacts/contracts/Invoice.sol/Invoice.json";
import contract from "../../../contract/address.json";
import { WaitForTransaction } from "./WaitForTransaction";
import { Dispatch, SetStateAction } from "react";

export const SendPayment = ({
  storage,
  id,
  index,
  setStatus,
}: {
  storage:string
  id: `0x${string}`;
  index: number;
  setStatus: Dispatch<SetStateAction<string>>;
}) => {
  const { data, isLoading, isSuccess, write, error } = useContractWrite({
    address: contract.invoice as `0x${string}`,
    abi: invoice.abi,
    functionName: "sendPayment",
    args: [id, BigInt(index)],
    onSuccess(){
      setStatus("1")
      localStorage.setItem(storage, "true");
    }
  });
  if(error){
    console.error(error);
  }
  return (
    <>
      <div className="flex justify-center">
        <button
          className="deposit  w-4/5 bg-blue-500 text-white border border-blue-700 font-bold py-2 px-2 rounded h-12 shadow-md"
          disabled={!write}
          onClick={() => write?.()}
        >
          Deposit tokens
        </button>
      </div>
      {isSuccess && data && <WaitForTransaction hash={data.hash} />}
      {isLoading && <AlertLoading />}
      {error && <AlertError error={error} />}
    </>
  );
};
