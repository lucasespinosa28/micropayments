"use client";
import { useContractRead } from "wagmi";
import metadata from "../../abi/Invoice.json";
import { Invoice } from "./types";
import { OffChain } from "./OffChain";
import { OnChain } from "./OnChain";
import { Switch } from "./Switch";
import { contract } from "./page";
import { shortAddress } from "./shortAddress";

export const Payments = ({ id }: { id: string }) => {
  const { data, isError, isLoading } = useContractRead({
    address: contract,
    abi: metadata.abi,
    functionName: "getInvoice",
    args: [id],
  });
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;
  if (data) {
    let timestamp: Date = new Date(
      Number((data as Invoice).timestamp.toString()) * 1000
    );
    return (
      <div className="flex flex-col">
        <div>
          <table className="table-auto">
            <thead>
              <tr>
                <th>ID</th>
                <th>date</th>
                <th>Token</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{id}</td>
                <td>{timestamp.toUTCString()}</td>
                <td>{shortAddress((data as Invoice).token)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <Switch
          offchain={<OffChain id={(data as Invoice).payments} />}
          onchain={<OnChain id={(data as Invoice).payments} />}
        />
      </div>
    );
  }
};
