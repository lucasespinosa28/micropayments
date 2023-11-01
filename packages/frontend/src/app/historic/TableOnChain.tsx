"use client";
import { formatUnits } from "viem";
import { useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ResponseOn } from "./types";
import { shortAddress } from "./shortAddress";

const onChainColumnHelper = createColumnHelper<ResponseOn>();
const columns = [
  onChainColumnHelper.accessor("receiver", {
    cell: (info) => shortAddress(info.getValue()),
  }),
  onChainColumnHelper.accessor("amount", {
    cell: (info) => parseFloat(formatUnits(info.getValue(), 18)).toFixed(2),
  }),
];
export function TableOnChain({
  total,
  defaultData,
}: {
  total: any;
  defaultData: ResponseOn[];
}) {
  const [data, setData] = useState(() => [...defaultData]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
     <div>
        <div>
          {table.getHeaderGroups().map((headerGroup) => (
            <div className="bg-slate-600 text-slate-50 font-bold text-left flex justify-between" key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <div className="mx-4" key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div>
          {table.getRowModel().rows.map((row) => (
            <div className="flex border justify-between" key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <div className="mx-4" key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <table className="table-auto w-full">
        <thead className="bg-slate-600 text-slate-50 text-left w-full ">
          <tr>
            <th>Total:{total}</th>
          </tr>
        </thead>
        <tbody className="w-full">
          <tr>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
