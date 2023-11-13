import { useContractWrite } from "wagmi";
import invoice from "../../../contract/artifacts/contracts/Invoice.sol/Invoice.json";
import contract from "../../../contract/address.json";
import { WaitForTransaction } from "./WaitForTransaction";
import { AlertError, AlertLoading } from "./alert";

export const Confirm = ({
  id,
  index,
  isReceiver,
}: {
  id: `0x${string}`;
  index: number;
  isReceiver:boolean;
}) => {
  const label:string = isReceiver?"Confirm":"Send payment";
  const { data, isLoading, isSuccess, write, error } = useContractWrite({
    address: contract.invoice as `0x${string}`,
    abi: invoice.abi,
    functionName: "confirm",
    args: [id, BigInt(index)],
  });

  return (
    <>
      <div className="flex justify-center">
        <button
          className="w-4/5 bg-lime-500 text-white border  border-lime-700 font-bold py-2 px-2 rounded   h-12 shadow-md"
          disabled={!write}
          onClick={() => write?.()}
        >
          {label}
        </button>
      </div>
      {isSuccess && data && <WaitForTransaction hash={data.hash} />}
      {isLoading && <AlertLoading />}
      {error && <AlertError error={error} />}
    </>
  );
};
