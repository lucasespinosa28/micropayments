import { useContractWrite } from "wagmi";
import { abi } from "../../Invoice.json";
import { WaitForTransaction } from "./WaitForTransaction";
import { AlertError, AlertLoading } from "../statics/alert";
import { parseUnits, stringToHex } from "viem";
import { nanoid } from "nanoid";
import { InputValues } from "../../app/create/InputValues";
import { useRef, useState } from "react";
import { ButtonPrimary } from "@/compoments/inputs/buttons";
import { paymentsContract } from "@/contract";

export interface ContractArgs {
  receiver: string;
  payer: string;
  dateTime: string;
  amount: string;
  token: `0x${string}`;
}

export const WriteCreate = ({
  setId,
  tokenAddress,
  data,
}: {
  tokenAddress: `0x${string}`;
  setId: React.Dispatch<React.SetStateAction<string>>;
  data: InputValues[];
}) => {
  const idRef = useRef(nanoid());
  const [isDisabled, setDisabled] = useState<boolean>(false);
  const dateTime: bigint[] = data.map((item) =>
    BigInt(new Date(item.dateTime).getTime() / 1000)
  );
  const token: `0x${string}`[] = data.map(() => tokenAddress);
  const amount: bigint[] = data.map((item) => parseUnits(item.amount, 18));
  const payer: `0x${string}`[] = data.map(
    (item) => item.payer as `0x${string}`
  );
  const receiver: `0x${string}`[] = data.map(
    (item) => item.receiver as `0x${string}`
  );
  console.log({
    args: [
      stringToHex(idRef.current, { size: 32 }),
      dateTime,
      token,
      amount,
      payer,
      receiver,
    ],
  });
  const {
    data: contract,
    isLoading,
    isSuccess,
    write,
    error,
  } = useContractWrite({
    address: paymentsContract,
    abi: abi,
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
      setDisabled(true);
    },
  });
  return (
    <>
      <ButtonPrimary
        id="create"
        onClick={() => write?.()}
        disabled={isDisabled}
      >
        <p>Create payment list</p>
      </ButtonPrimary>
      {isSuccess && contract && <WaitForTransaction hash={contract.hash} />}
      {isLoading && (
        <AlertLoading>
          <p>Loading...</p>
        </AlertLoading>
      )}
      {error && <AlertError error={error} />}
    </>
  );
};
