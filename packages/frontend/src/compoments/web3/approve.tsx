import { useContractWrite } from "wagmi";
import { abi } from "../../../../contract/artifacts/contracts/Token.sol/Token.json";
// import contract from "../../../../contract/address.json";
import { WaitForTransaction } from "./WaitForTransaction";
import {  useState } from "react";
import { AlertError, AlertLoading } from "../statics/alert";
import { ButtonPrimary } from "../inputs/buttons";

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
  const { write, isSuccess, isLoading, data, error } = useContractWrite({
    address: token,
    abi: abi,
    functionName: "approve",
    args: ["0x154b7a820f08729AEE849620aE058EF8d3CE967f", amount],
    onSuccess() {
      setDisplayed(true);
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
