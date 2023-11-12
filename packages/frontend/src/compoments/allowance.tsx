import { useContractRead } from "wagmi";
import token from "../../../contract/artifacts/contracts/Token.sol/Token.json";
import contracts from "../../../contract/address.json";
import { Dispatch, SetStateAction, useEffect } from "react";

export const Allowance = ({
  address,
  contract,
  setAllowanceAmount
}: {
  address: `0x${string}`;
  contract: `0x${string}`;
  setAllowanceAmount:Dispatch<SetStateAction<bigint>>
}) => {
  const { data: allowance,isFetching,error } = useContractRead({
    address: contract,
    abi: token.abi,
    functionName: "allowance",
    args: [address, contracts.invoice],
  });
  useEffect(() =>{
    if(allowance != undefined){
      setAllowanceAmount(allowance as bigint);
    }
  },[allowance,setAllowanceAmount])
  return (
    <>
    {isFetching && ( <div>Loading...</div>)}
      {error && (
        <div>An error occurred preparing the transaction: {error.message}</div>
      )}
      {allowance && <h1>Amount App{allowance.toString()}</h1>}
    </>
  );
};
