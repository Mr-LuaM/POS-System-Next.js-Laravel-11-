"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

/**
 * ✅ Stock Movement Table Columns
 */
export const getStockMovementColumns = (): ColumnDef<any>[] => [
  {
    accessorKey: "store_name",
    header: "Store",
    cell: ({ row }) => (
      <span className="font-medium text-foreground">{row.original.store_name}</span>
    ),
  },
  {
    accessorKey: "product_name",
    header: "Product",
    cell: ({ row }) => (
      <span className="font-medium text-foreground">{row.original.product_name}</span>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <span
        className={`px-2 py-1 rounded-md text-xs font-semibold ${
          row.original.type === "restock"
            ? "bg-green-100 text-green-700"
            : row.original.type === "sale"
            ? "bg-red-100 text-red-700"
            : "bg-gray-100 text-gray-700"
        }`}
      >
        {row.original.type.charAt(0).toUpperCase() + row.original.type.slice(1)}
      </span>
    ),
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: ({ row }) => <span>{row.original.quantity}</span>,
  },
  {
    accessorKey: "reason",
    header: "Reason",
    cell: ({ row }) => <span className="truncate">{row.original.reason || "N/A"}</span>,
  },
  {
    accessorKey: "created_at",
    header: "Date",
    cell: ({ row }) => (
      <span>{format(new Date(row.original.created_at), "yyyy-MM-dd HH:mm:ss")}</span>
    ),
  },
];
