import { usePrepareContractWrite, useContractWrite } from 'wagmi'
import invoice from "../../../contract/artifacts/contracts/Invoice.sol/Invoice.json";
import contract from "../../../contract/address.json"
import { WaitForTransaction } from './WaitForTransaction';

export const Confirm = ({id,index}:{id:`0x${string}`, index:number})  => {

  const { data, isLoading, isSuccess, write,error } = useContractWrite({
    address: contract.invoice as `0x${string}`,
    abi: invoice.abi,
    functionName: "confirm",
    args: [id, BigInt(index)],
  })
 
  return (
    <>
     <button
        className="bg-lime-500 text-white border  border-lime-700 font-bold py-2 px-2 rounded w-full  h-12 shadow-md"
        disabled={!write}
        onClick={() => write?.()}
      >
      Confirm
      </button>
      {isSuccess && <WaitForTransaction hash={data.hash}/>}
      {error && (
        <div>An error occurred preparing the transaction: {error.message}</div>
      )}
    </>
  )
}