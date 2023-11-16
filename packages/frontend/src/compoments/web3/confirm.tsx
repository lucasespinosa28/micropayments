import { useContractWrite } from "wagmi";
import invoice from "../../../../contract/artifacts/contracts/Invoice.sol/Invoice.json";
//import contract from "../../../../contract/address.json";
import { WaitForTransaction } from "./WaitForTransaction";
import { AlertError, AlertLoading } from "../statics/alert";
import { useState } from "react";
import { ButtonSecondary } from "../inputs/buttons";

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
    address: "0x154b7a820f08729AEE849620aE058EF8d3CE967f",
    abi: invoice.abi,
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
