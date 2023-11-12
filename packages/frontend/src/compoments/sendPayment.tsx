import { usePrepareContractWrite, useContractWrite } from 'wagmi'

import invoice from "../../../contract/artifacts/contracts/Invoice.sol/Invoice.json";
import contract from "../../../contract/address.json"
import { WaitForTransaction } from './WaitForTransaction';

export const SendPayment = ({id,index}:{id:`0x${string}`, index:number})  => {

  const { data, isLoading, isSuccess, write,error } = useContractWrite({
    address: contract.invoice as `0x${string}`,
    abi: invoice.abi,
    functionName: "sendPayment",
    args: [id, BigInt(index)],
  })
 
  return (
    <>
      <button disabled={!write} onClick={() => write?.()}>
        send Payment
      </button>
      {isSuccess && <WaitForTransaction hash={data.hash}/>}
      {error && (
        <div>An error occurred preparing the transaction: {error.message}</div>
      )}
    </>
  )
}