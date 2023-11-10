import { PublicClient } from "viem";
import contracts from "../address.json";
import invoice from "../artifacts/contracts/Invoice.sol/Invoice.json";

export async function getPayments(publicClient: PublicClient, id: `0x${string}`) {
  return await publicClient.readContract({
    address: contracts.invoice as `0x${string}`,
    abi: invoice.abi,
    functionName: 'getPayments',
    args: [id]
  });
}
