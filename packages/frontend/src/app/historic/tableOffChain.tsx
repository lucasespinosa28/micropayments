"use client";
import { formatUnits } from "viem";
import { useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Payments, ResponseOff } from "./types";
import { shortAddress } from "./shortAddress";

const onChainColumnHelper = createColumnHelper<Payments>();
const columns = [
  onChainColumnHelper.accessor("address", {
    cell: (info) => shortAddress(info.getValue()),
  }),
  onChainColumnHelper.accessor("name", {
    cell: (info) => info.getValue(),
  }),
  onChainColumnHelper.accessor("quantity", {
    cell: (info) => info.getValue(),
  }),
  onChainColumnHelper.accessor("amount", {
    cell: (info) => info.getValue(),
  }),
  onChainColumnHelper.accessor("notes", {
    cell: (info) => info.getValue(),
  }),
];
export function TableOffChain({
  total,
  defaultData,
}: {
  total: any;
  defaultData: ResponseOff;
}) {
  const [data, setData] = useState(() => [...defaultData.payments]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <div className="overflow-x-auto bg-slate-600">
      <table className="table-auto">
        <thead >
          {table.getHeaderGroups().map((headerGroup) => (
             <tr className="text-slate-50 font-bold" key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                if (header.id === "quantity") {
                  return <th key={header.id}>qty</th>;
                }
                return (
                  <th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
             <tr className="bg-slate-50 border" key={row.id}>
              {row.getVisibleCells().map((cell) => {
                return (
                  <td className="overflow-ellipsis whitespace-nowrap" key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="text-slate-50 text-left w-full inline-block">
        <div className="mx-4">Total:{total}</div>
     
      </div>
    </div>
  );
}
