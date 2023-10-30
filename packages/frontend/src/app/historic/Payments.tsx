"use client";
import { useContractRead } from "wagmi";
import metadata from "../../abi/Invoice.json";
import { Invoice } from "./types";
import { OffChain } from "./OffChain";
import { OnChain } from "./OnChain";
import { Switch } from "./Switch";
import { contract } from "./page";

export const Payments = ({ id }: { id: string; }) => {
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
      <div>
        <p>{timestamp.toUTCString()}</p>
        <p>{(data as Invoice).receiver}</p>
        <p>{(data as Invoice).payments}</p>

        <p>{(data as Invoice).token}</p>
        <Switch
          offchain={<OffChain id={(data as Invoice).payments} />}
          onchain={<OnChain id={(data as Invoice).payments} />} />
      </div>
    );
  }
};
