import { usePrepareContractWrite, useContractWrite } from 'wagmi'
import token from "../../../contract/artifacts/contracts/Token.sol/Token.json";
import contract from "../../../contract/address.json"
import { WaitForTransaction } from './WaitForTransaction';
import { Dispatch, SetStateAction, useEffect } from 'react';

export const Approve = ({amount,id,setApproved}:{amount:bigint,id:string,setApproved:Dispatch<SetStateAction<boolean>>}) => {
    const { config, error } = usePrepareContractWrite({
      address: contract.token as `0x${string}`,
      abi: token.abi,
      functionName: "approve",
      args: [contract.invoice as `0x${string}`,amount],
    })
    const { write, isSuccess,data } = useContractWrite(config)
    useEffect(() => {
      if(isSuccess){
        localStorage.setItem(id, "true");
        setApproved(true);
      }
    },[id, isSuccess, setApproved])
    return (
      <>
       <button
        className="bg-blue-500 text-white border  border-blue-700 font-bold py-2 px-2 rounded w-full h-12 shadow-md"
        disabled={!write}
        onClick={() => write?.()}
      >
          Approve
        </button>
        {isSuccess && <WaitForTransaction hash={data.hash}/>}
        {error && (
          <div>An error occurred preparing the transaction: {error.message}</div>
        )}
      </>
    )
  }