import { useContractWrite } from "wagmi";
import invoice from "../../../../contract/artifacts/contracts/Invoice.sol/Invoice.json";
import contract from "../../../../contract/address.json";
import { WaitForTransaction } from "./WaitForTransaction";
import { AlertError, AlertLoading } from "../statics/alert";
import { useContext, useState } from "react";
import { ButtonError } from "../inputs/buttons";
import { reloading } from "@/app/Payments";

export const Cancel = ({ id, index }: { id: `0x${string}`; index: number }) => {
  const [isDisabled, SetDisabled] = useState<boolean>(false);
  const { reload, setReload } = useContext(reloading);
  const { data, isSuccess, write, error, isLoading } = useContractWrite({
    address: contract.invoice as `0x${string}`,
    abi: invoice.abi,
    functionName: "cancel",
    args: [id, BigInt(index)],
    onSuccess() {
      SetDisabled(true);
      if (setReload) {
        setReload(!reload);
      }
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
