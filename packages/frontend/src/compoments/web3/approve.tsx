import { useContractWrite } from "wagmi";
import { abi } from "../../../../contract/artifacts/contracts/Token.sol/Token.json";
import contract from "../../../../contract/address.json";
import { WaitForTransaction } from "./WaitForTransaction";
import { useContext, useState } from "react";
import { AlertError, AlertLoading } from "../statics/alert";
import { ButtonPrimary } from "../inputs/buttons";
import { reloading } from "@/app/Payments";

export const Approve = ({
  token,
  amount,
  label = "Approve",
  index = 0,
}: {
  token: `0x${string}`;
  amount: bigint;
  label?: string;
  id: string;
  index?: number;
}) => {
  const [isDisplayed, setDisplayed] = useState<boolean>(false);
  const { reload, setReload } = useContext(reloading);
  const { write, isSuccess, isLoading, data, error } = useContractWrite({
    address: token,
    abi: abi,
    functionName: "approve",
    args: [contract.invoice as `0x${string}`, amount],
    onSuccess() {
      setDisplayed(true);
      if (setReload) {
        setReload(!reload);
      }
    },
  });
  return (
    <>
      <ButtonPrimary
        id={"approve" + index}
        onClick={() => write?.()}
        disabled={isDisplayed}
      >
        <>{label}</>
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
