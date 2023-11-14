import { useContractWrite } from "wagmi";
import invoice from "../../../../contract/artifacts/contracts/Invoice.sol/Invoice.json";
import contract from "../../../../contract/address.json";
import { WaitForTransaction } from "./WaitForTransaction";
import { AlertError, AlertLoading } from "../statics/alert";
import { Dispatch, SetStateAction, useState } from "react";
import { ButtonError } from "../inputs/buttons";

export const Cancel = ({
  id,
  index,
  setStatus,
}: {
  id: `0x${string}`;
  index: number;
  setStatus: Dispatch<SetStateAction<bigint>>;
}) => {
  const [isDisabled, SetDisabled] = useState<boolean>(false);
  const { data, isSuccess, write, error, isLoading } = useContractWrite({
    address: contract.invoice as `0x${string}`,
    abi: invoice.abi,
    functionName: "cancel",
    args: [id, BigInt(index)],
    onSuccess() {
      setStatus(3n);
      SetDisabled(true);
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
