import { useContractWrite } from "wagmi";
import { abi } from "../../Invoice.json";
import { WaitForTransaction } from "./WaitForTransaction";
import { AlertError, AlertLoading } from "../statics/alert";
import { useState } from "react";
import { ButtonError } from "../inputs/buttons";
import { paymentsContract } from "@/contract";

export const Cancel = ({ id, index }: { id: `0x${string}`; index: number }) => {
  const [isDisabled, SetDisabled] = useState<boolean>(false);
  const { data, isSuccess, write, error, isLoading } = useContractWrite({
    address: paymentsContract,
    abi: abi,
    functionName: "cancel",
    args: [id, BigInt(index)],
    onSuccess() {
      SetDisabled(true);
    },
  });
  return (
    <>
      <ButtonError id="create" onClick={() => write?.()} disabled={isDisabled}>
        <p>Cancel</p>
      </ButtonError>
      {isSuccess && data && <WaitForTransaction hash={data.hash} />}
      {isLoading && (
        <AlertLoading>
          <p>Loading...</p>
        </AlertLoading>
      )}
      {error && <AlertError error={error} />}
    </>
  );
};
