import { usePrepareContractWrite, useContractWrite } from 'wagmi'
import token from "../../../contract/artifacts/contracts/Token.sol/Token.json";
import contract from "../../../contract/address.json"
import { parseUnits } from 'viem';
import { WaitForTransaction } from './WaitForTransaction';

export const Approve = ({amount}:{amount:bigint}) => {
    const { config, error } = usePrepareContractWrite({
      address: contract.token as `0x${string}`,
      abi: token.abi,
      functionName: "approve",
      args: [contract.invoice as `0x${string}`,amount],
    })
    const { write, isSuccess,data } = useContractWrite(config)
   
    return (
      <>
        <button disabled={!write} onClick={() => write?.()}>
          Approve
        </button>
        {isSuccess && <WaitForTransaction hash={data.hash}/>}
        {error && (
          <div>An error occurred preparing the transaction: {error.message}</div>
        )}
      </>
    )
  }