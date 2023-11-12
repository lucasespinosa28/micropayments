import { useContractRead } from "wagmi";
import token from "../../../contract/artifacts/contracts/Token.sol/Token.json";
import contracts from "../../../contract/address.json";

export const Allowance = ({
  address,
  contract,
}: {
  address: `0x${string}`;
  contract: `0x${string}`;
}) => {
  const { data,isSuccess,error } = useContractRead({
    address: contract,
    abi: token.abi,
    functionName: "allowance",
    args: [address, contracts.invoice],
  });
  console.log(isSuccess);
  return (
    <>
      {error && (
        <div>An error occurred preparing the transaction: {error.message}</div>
      )}
      {isSuccess&& <h1>Success</h1>}
      {data && <h1>Amount App{data.toString()}</h1>}
    </>
  );
};
