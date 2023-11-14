import { useContractWrite } from "wagmi";
import invoice from "../../../../contract/artifacts/contracts/Invoice.sol/Invoice.json";
import contract from "../../../../contract/address.json";
import { WaitForTransaction } from "./WaitForTransaction";
import { AlertError, AlertLoading } from "../statics/alert";
import { Dispatch, SetStateAction, useState } from "react";
import { ButtonSecondary } from "../inputs/buttons";
export const Confirm = ({
  id,
  index,
  isReceiver,
  setStatus,
}: {
  id: `0x${string}`;
  index: number;
  isReceiver: boolean;
  setStatus: Dispatch<SetStateAction<bigint>>;
}) => {
  const [isDisplayed, setDisplayed] = useState<boolean>(false);
  const label: string = isReceiver ? "Confirm" : "Send payment";
  const { data, isLoading, isSuccess, write, error } = useContractWrite({
    address: contract.invoice as `0x${string}`,
    abi: invoice.abi,
    functionName: "confirm",
    args: [id, BigInt(index)],
    onSuccess() {
      setStatus(2n);
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
