import { useContractWrite } from "wagmi";
import invoice from "../../../../contract/artifacts/contracts/Invoice.sol/Invoice.json";
import contracts from "../../../../contract/address.json";
import { WaitForTransaction } from "../../compoments/WaitForTransaction";
import { AlertError, AlertLoading } from "../../compoments/alert";
import { parseUnits, stringToHex } from "viem";
import { nanoid } from "nanoid";
import { InputValues } from "./InputValues";
import { useEffect, useRef } from "react";

export interface ContractArgs {
  receiver: string;
  payer: string;
  dateTime: string;
  amount: string;
  token: `0x${string}`;
}

export const WriteCreate = ({
  setId,
  inputValues,
}: {
  setId: React.Dispatch<React.SetStateAction<string>>;
  inputValues: ContractArgs[];
}) => {
    const idRef = useRef(nanoid());
  let dateTime: bigint[] = inputValues.map((item) =>
    BigInt(new Date(item.dateTime).getTime() / 1000)
  );
  let token: `0x${string}`[] = inputValues.map((item) => item.token);
  let amount: bigint[] = inputValues.map((item) => parseUnits(item.amount, 18));
  let payer: `0x${string}`[] = inputValues.map(
    (item) => item.payer as `0x${string}`
  );
  let receiver: `0x${string}`[] = inputValues.map(
    (item) => item.receiver as `0x${string}`
  );
  console.log({first:idRef.current});
  const { data, isLoading, isSuccess, write, error } = useContractWrite({
    address: contracts.invoice as `0x${string}`,
    abi: invoice.abi,
    functionName: "createPayment",
    args: [
      stringToHex(idRef.current, { size: 32 }),
      dateTime,
      token,
      amount,
      payer,
      receiver,
    ],
    onSuccess() {
      setId(idRef.current);
      console.log({ before:idRef.current });
    },
  });
  return (
    <>
      <div className="flex justify-center">
        <button
          className="w-4/5 bg-lime-500 text-white border  border-lime-700 font-bold py-2 px-2 rounded   h-12 shadow-md"
          disabled={!write}
          onClick={() => write?.()}
          id="create"
        >
          Create payment list
        </button>
      </div>
      {isSuccess && data && <WaitForTransaction hash={data.hash} />}
      {isLoading && <AlertLoading />}
      {error && <AlertError error={error} />}
    </>
  );
};
