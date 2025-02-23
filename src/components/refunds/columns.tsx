"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

/**
 * ✅ Refunds Table Columns
 */
export const getRefundColumns = ({
  onViewSale,
}: {
  onViewSale: (saleId: number) => void;
}): ColumnDef<any>[] => [
  {
    accessorKey: "id",
    header: "Refund ID",
    cell: ({ row }) => (
      <span className="font-medium text-foreground">#{row.original.id}</span>
    ),
  },
  {
    accessorKey: "sale_id",
    header: "Sale ID",
    cell: ({ row }) => (
      <Button
        variant="link"
        onClick={() => onViewSale(row.original.sale_id)}
        className="text-blue-600 hover:underline"
      >
        #{row.original.sale_id}
      </Button>
    ),
  },
  {
    accessorKey: "amount",
    header: "Refund Amount",
    cell: ({ row }) => (
      <span className="font-bold text-red-600">
        ₱{parseFloat(row.original.amount).toFixed(2)}
      </span>
    ),
  },
  {
    accessorKey: "reason",
    header: "Reason",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.reason || "N/A"}</span>
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
