"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

/**
 * ✅ Payments Table Columns
 */
export const getPaymentsColumns = (): ColumnDef<any>[] => [
  {
    accessorKey: "id",
    header: "Payment ID",
    cell: ({ row }) => (
      <span className="font-medium text-foreground">#{row.original.id}</span>
    ),
  },
  {
    accessorKey: "sale_id",
    header: "Sale ID",
    cell: ({ row }) => (
      <span className="text-primary font-semibold">#{row.original.sale_id}</span>
    ),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => (
      <span className="font-bold text-green-600">₱{row.original.amount}</span>
    ),
  },
  {
    accessorKey: "method",
    header: "Payment Method",
    cell: ({ row }) => (
      <span
        className={`px-2 py-1 rounded-md text-xs font-semibold ${
          row.original.method === "cash"
            ? "bg-green-100 text-green-700"
            : row.original.method === "credit_card"
            ? "bg-blue-100 text-blue-700"
            : "bg-gray-100 text-gray-700"
        }`}
      >
        {row.original.method.charAt(0).toUpperCase() + row.original.method.slice(1)}
      </span>
    ),
  },
 
  {
    accessorKey: "created_at",
    header: "Date",
    cell: ({ row }) => (
      <span>{format(new Date(row.original.created_at), "yyyy-MM-dd HH:mm:ss")}</span>
    ),
  },
];
