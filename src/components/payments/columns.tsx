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
    cell: ({ row }) => {
      const payment = row.original;
      const formattedDate = format(new Date(payment.created_at), "yyyy-MM-dd");
      return (
        <span className="font-medium text-foreground">
          {formattedDate} - {payment.store_name} - #{payment.id}
        </span>
      );
    },
  },
  {
    accessorKey: "sale_id",
    header: "Sale ID",
    cell: ({ row }) => {
      const sale = row.original;
      const formattedDate = format(new Date(sale.created_at), "yyyy-MM-dd");
      return (
        <span className="text-primary font-semibold">
          {formattedDate} - {sale.store_name} - #{sale.sale_id}
        </span>
      );
    },
  },
  
  {
    accessorKey: "store_name",
    header: "Store",
    cell: ({ row }) => (
      <span className="text-foreground">{row.original.store_name}</span>
    ),
  },
  {
    accessorKey: "cashier_name",
    header: "Cashier",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.cashier_name}</span>
    ),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => (
      <span className="font-bold text-green-600">
        ₱{parseFloat(row.original.amount).toFixed(2)}
      </span>
    ),
  },
  {
    accessorKey: "method",
    header: "Payment Method",
    cell: ({ row }) => {
      const method = row.original.method.toLowerCase();
      const display = method.charAt(0).toUpperCase() + method.slice(1);
      const style =
        method === "cash"
          ? "bg-green-100 text-green-700"
          : method === "credit_card"
          ? "bg-blue-100 text-blue-700"
          : "bg-gray-100 text-gray-700";
      return (
        <span className={`px-2 py-1 rounded-md text-xs font-semibold ${style}`}>
          {display}
        </span>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Date",
    cell: ({ row }) => (
      <span>{format(new Date(row.original.created_at), "yyyy-MM-dd HH:mm:ss")}</span>
    ),
  },
];
