import { useContractWrite } from "wagmi";
import { AlertError, AlertLoading } from "../statics/alert";
import invoice from "../../../../contract/artifacts/contracts/Invoice.sol/Invoice.json";
import contract from "../../../../contract/address.json";
import { WaitForTransaction } from "./WaitForTransaction";
import { Dispatch, SetStateAction, useState } from "react";
import { ButtonPrimary } from "../../compoments/inputs/buttons";
export const SendPayment = ({
  id,
  index,
  setStatus,
}: {
  id: `0x${string}`;
  index: number;
  setStatus: Dispatch<SetStateAction<bigint>>;
}) => {
  const [isDisplayed, setDisplayed] = useState<boolean>(false);
  const { data, isLoading, isSuccess, write, error } = useContractWrite({
    address: contract.invoice as `0x${string}`,
    abi: invoice.abi,
    functionName: "sendPayment",
    args: [id, BigInt(index)],
    onSuccess() {
      setStatus(1n);
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
