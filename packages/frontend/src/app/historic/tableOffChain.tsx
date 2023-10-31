"use client";
import { formatUnits } from "viem";
import { useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable
} from "@tanstack/react-table";
import { Payments,ResponseOff } from "./types";

const onChainColumnHelper = createColumnHelper<Payments>();
const columns = [
  onChainColumnHelper.accessor("address", {
    cell: (info) => info.getValue(),
  }),
  onChainColumnHelper.accessor("name", {
    cell: (info) => info.getValue(),
  }),
  onChainColumnHelper.accessor("notes", {
    cell: (info) => info.getValue(),
  }),
  onChainColumnHelper.accessor("quantity", {
    cell: (info) => info.getValue(),
  }),
  onChainColumnHelper.accessor("amount", {
    cell: (info) => info.getValue(),
  }),
];
export function TableOffChain({ defaultData }: { defaultData: ResponseOff }) {
  const [data, setData] = useState(() => [...defaultData.payments]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
