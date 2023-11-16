import { useContractWrite } from "wagmi";
import invoice from "../../../../contract/artifacts/contracts/Invoice.sol/Invoice.json";
//import contract from "../../../../contract/address.json";
import { WaitForTransaction } from "./WaitForTransaction";
import { AlertError, AlertLoading } from "../statics/alert";
import { useState } from "react";
import { ButtonError } from "../inputs/buttons";

export const Cancel = ({ id, index }: { id: `0x${string}`; index: number }) => {
  const [isDisabled, SetDisabled] = useState<boolean>(false);
  const { data, isSuccess, write, error, isLoading } = useContractWrite({
    address: "0x154b7a820f08729AEE849620aE058EF8d3CE967f",
    abi: invoice.abi,
    functionName: "cancel",
    args: [id, BigInt(index)],
    onSuccess() {
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
