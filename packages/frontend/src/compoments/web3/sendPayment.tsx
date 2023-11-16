import { useContractWrite } from "wagmi";
import { AlertError, AlertLoading } from "../statics/alert";
import invoice from "../../../../contract/artifacts/contracts/Invoice.sol/Invoice.json";
//import contract from "../../../../contract/address.json";
import { WaitForTransaction } from "./WaitForTransaction";
import { ButtonPrimary } from "../../compoments/inputs/buttons";
import { useState } from "react";

export const SendPayment = ({
  id,
  index,
}: {
  id: `0x${string}`;
  index: number;
}) => {
  const [isDisplayed, setDisplayed] = useState<boolean>(false);
  
  const { data, isLoading, isSuccess, write, error } = useContractWrite({
    address: "0x154b7a820f08729AEE849620aE058EF8d3CE967f",
    abi: invoice.abi,
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
