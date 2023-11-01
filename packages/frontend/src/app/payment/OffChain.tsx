"use client";
import { useEffect, useState } from "react";
import { TableOffChain } from "../historic/tableOffChain";
import { useRead } from "../../hooks/useRead";
import { ResponseOff } from "../historic/types";
import { Balance } from "./Balance";
import { Appove } from "./Appove";
import { Payments } from "./Payments";
import { SendPayment } from "./SendPayment";

export const OffChain = ({
  id,
  address,
}: {
  id: string;
  address: `0x${string}`;
}) => {
  const { data, loading, error, fetchData } = useRead({ id });
  useEffect(() => {
    fetchData(id);
  }, [id]);
  const [isPiad, setIsPiad] = useState<boolean>(false);
  if (loading) return <div>Loading3...</div>;
  if (error != null) return <div>Error: {error.message}</div>;
  if (data?.success === false) {
    return (
      <div className="bg-red-500 text-white font-bold py-2 px-4 m-2 rounded w-64  shadow-md">
        <div className="flex flex-col">
          <span>Invoice not found</span>
        </div>
      </div>
    );
  }
  if (data?.success) {
    return (
      <>
        <Payments id={id} setIsPiad={setIsPiad} />
        <Balance address={address} contract={data.message.token} />
        <div className="bg-red-900 overflow-x-auto w-full">
          <TableOffChain
            total={data.total}
            defaultData={data.message as ResponseOff[]}
          />
        </div>
        <div>
          {!isPiad && <Appove amount={data.total} />}
          {!isPiad && (
            <SendPayment
              id={id}
              address={address}
              payments={data.message.payments}
            />
          )}
        </div>
      </>
    );
  }
};
