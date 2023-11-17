import { useContractWrite } from "wagmi";
import { AlertError, AlertLoading } from "../statics/alert";
import { abi } from "../../Invoice.json";
import { WaitForTransaction } from "./WaitForTransaction";
import { useState } from "react";
import { ButtonPrimary } from "../inputs/buttons";
import { paymentsContract } from "@/contract";

export const SendAllPayment = ({
  id,
  index,
}: {
  id: `0x${string}`;
  index: bigint[];
}) => {
  const [isDisplayed, setDisplayed] = useState<boolean>(false);

  const { data, isLoading, isSuccess, write, error } = useContractWrite({
    address: paymentsContract,
    abi: abi,
    functionName: "sendAllPayment",
    args: [id, index],
    onSuccess() {
      setDisplayed(true);
    },
    onError(error) {
      console.error(error);
    },
  });
  if (error) {
    console.error(error);
  }
  return (
    <>
      <ButtonPrimary
        id={"approve" + index}
        onClick={() => write?.()}
        disabled={isDisplayed}
      >
        <>Deposit tokens for all</>
      </ButtonPrimary>
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
