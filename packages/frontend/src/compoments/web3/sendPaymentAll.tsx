import { useContractWrite } from "wagmi";
import { AlertError, AlertLoading } from "../statics/alert";
import invoice from "../../../../contract/artifacts/contracts/Invoice.sol/Invoice.json";
import contract from "../../../../contract/address.json";
import { WaitForTransaction } from "./WaitForTransaction";
import { useState } from "react";
import { ButtonPrimary } from "../inputs/buttons";

export const SendAllPayment = ({
  id,
  index,
}: {
  id: `0x${string}`;
  index: bigint[];
}) => {
  const [isDisplayed, setDisplayed] = useState<boolean>(false);

  const { data, isLoading, isSuccess, write, error } = useContractWrite({
    address: contract.invoice as `0x${string}`,
    abi: invoice.abi,
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
