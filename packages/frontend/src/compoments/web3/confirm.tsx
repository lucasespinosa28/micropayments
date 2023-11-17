import { useContractWrite } from "wagmi";
import { abi } from "../../Invoice.json";
import { WaitForTransaction } from "./WaitForTransaction";
import { AlertError, AlertLoading } from "../statics/alert";
import { useState } from "react";
import { ButtonSecondary } from "../inputs/buttons";
import { paymentsContract } from "@/contract";

export const Confirm = ({
  id,
  index,
  isReceiver,
}: {
  id: `0x${string}`;
  index: number;
  isReceiver: boolean;
}) => {
  const [isDisplayed, setDisplayed] = useState<boolean>(false);
  const label: string = isReceiver ? "Confirm" : "Send payment";
  const { data, isLoading, isSuccess, write, error } = useContractWrite({
    address: paymentsContract,
    abi: abi,
    functionName: "confirm",
    args: [id, BigInt(index)],
    onSuccess() {
      setDisplayed(true);
    },
  });

  return (
    <>
      <ButtonSecondary
        id={"approve" + index}
        onClick={() => write?.()}
        disabled={isDisplayed}
      >
        <>{label}</>
      </ButtonSecondary>
      {isSuccess && data && <WaitForTransaction hash={data.hash} />}
      {isLoading && (
        <AlertLoading>
          <>Loading...</>
        </AlertLoading>
      )}
      {error && <AlertError error={error} />}
    </>
  );
};
