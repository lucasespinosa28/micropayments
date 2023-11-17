import { useContractWrite } from "wagmi";
import { AlertError, AlertLoading } from "../statics/alert";
import { abi } from "../../Invoice.json";
//import contract from "../../../../contract/address.json";
import { WaitForTransaction } from "./WaitForTransaction";
import { ButtonPrimary } from "../../compoments/inputs/buttons";
import { useState } from "react";
import { paymentsContract } from "@/contract";

export const SendPayment = ({
  id,
  index,
}: {
  id: `0x${string}`;
  index: number;
}) => {
  const [isDisplayed, setDisplayed] = useState<boolean>(false);
  
  const { data, isLoading, isSuccess, write, error } = useContractWrite({
    address: paymentsContract,
    abi: abi,
    functionName: "sendPayment",
    args: [id, BigInt(index)],
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
        <>Deposit tokens</>
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
