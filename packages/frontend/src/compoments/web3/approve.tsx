import { useContractWrite } from "wagmi";
import token from "../../../../contract/artifacts/contracts/Token.sol/Token.json";
import contract from "../../../../contract/address.json";
import { WaitForTransaction } from "./WaitForTransaction";
import { Dispatch, SetStateAction, useState } from "react";
import { AlertError, AlertLoading } from "../statics/alert";
import { ButtonPrimary } from "../inputs/buttons";

export const Approve = ({
  amount,
  setStatus,
  id,
  index = 0,
}: {
  amount: bigint;
  setStatus: Dispatch<SetStateAction<bigint>>;
  id: string;
  index?: number;
}) => {
  const [isDisplayed, setDisplayed] = useState<boolean>(false);
  const { write, isSuccess, isLoading, data, error } = useContractWrite({
    address: contract.token as `0x${string}`,
    abi: token.abi,
    functionName: "approve",
    args: [contract.invoice as `0x${string}`, amount],
    onSuccess() {
      setStatus(0n);
      localStorage.setItem(id, "true");
      setDisplayed(true);
    },
  });
  return (
    <>
      {isDisplayed || localStorage.getItem(id) == "true" ? (
        <></>
      ) : (
        <ButtonPrimary
          id={"approve" + index}
          onClick={() => write?.()}
          disabled={isDisplayed}
        >
          <>Approve</>
        </ButtonPrimary>
      )}
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
