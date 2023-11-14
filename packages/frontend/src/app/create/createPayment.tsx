import { useContractWrite } from "wagmi";
import invoice from "../../../../contract/artifacts/contracts/Invoice.sol/Invoice.json";
import contracts from "../../../../contract/address.json";
import { WaitForTransaction } from "../../compoments/web3/WaitForTransaction";
import { AlertError, AlertLoading } from "../../compoments/statics/alert";
import { parseUnits, stringToHex } from "viem";
import { nanoid } from "nanoid";
import { InputValues } from "./InputValues";
import { useRef, useState } from "react";
import { ButtonPrimary } from "@/compoments/inputs/buttons";

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
    BigInt(new Date(item.dateTime).getTime() / 1000),
  );
  const token: `0x${string}`[] = data.map(() => tokenAddress);
  const amount: bigint[] = data.map((item) => parseUnits(item.amount, 18));
  const payer: `0x${string}`[] = data.map(
    (item) => item.payer as `0x${string}`,
  );
  const receiver: `0x${string}`[] = data.map(
    (item) => item.receiver as `0x${string}`,
  );

  const {
    data: contract,
    isLoading,
    isSuccess,
    write,
    error,
  } = useContractWrite({
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
