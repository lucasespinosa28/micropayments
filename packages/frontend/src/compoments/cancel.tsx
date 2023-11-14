import { useContractWrite } from "wagmi";
import invoice from "../../../contract/artifacts/contracts/Invoice.sol/Invoice.json";
import contract from "../../../contract/address.json";
import { WaitForTransaction } from "./WaitForTransaction";
import { AlertError, AlertLoading } from "./alert";

export const Cancel = ({ id, index }: { id: `0x${string}`; index: number }) => {
  const { data, isSuccess, write, error, isLoading } = useContractWrite({
    address: contract.invoice as `0x${string}`,
    abi: invoice.abi,
    functionName: "cancel",
    args: [id, BigInt(index)],
  });

  return (
    <>
      <div className="flex justify-center">
        <button
          className="cancel w-4/5 bg-red-500 text-white border m-1 border-red-900 font-bold py-2 px-2 rounded h-12 shadow-md"
          disabled={!write}
          onClick={() => write?.()}
        >
          Cancel
        </button>
      </div>
      {isSuccess && data && <WaitForTransaction hash={data.hash} />}
      {isLoading && <AlertLoading />}
      {error && <AlertError error={error} />}
    </>
  );
};
