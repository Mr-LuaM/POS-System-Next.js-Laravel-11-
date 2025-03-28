"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";

/**
 * ✅ Discount Table Columns (Handles CRUD Actions)
 */
export const getDiscountColumns = (
  handleEdit: (discount: {
    id: number;
    code: string;
    discount_value: number;
    discount_type: "fixed" | "percentage";
    applies_to: "all" | "category" | "product" | "min_purchase";
    valid_until: string;
    category_name?: string | null;
    product_name?: string | null;
    min_purchase_amount?: number | null;
  }) => void,
  handleDelete: (id: number) => void
): ColumnDef<any>[] => [
  {
    accessorKey: "code",
    header: "Code",
    cell: ({ row }) => <span className="text-foreground font-medium">{row.original.code}</span>,
  },
  {
    accessorKey: "discount_value",
    header: "Value",
    cell: ({ row }) => (
      <span>
        {row.original.discount_type === "percentage"
          ? `${row.original.discount_value}%`
          : `₱${parseFloat(row.original.discount_value).toFixed(2)}`}
      </span>
    ),
  },
  {
    accessorKey: "applies_to",
    header: "Applies To",
    cell: ({ row }) => (
      <span className="capitalize">{row.original.applies_to.replace("_", " ")}</span>
    ),
  },
  {
    accessorKey: "category_name",
    header: "Category",
    cell: ({ row }) => (
      <span>{row.original.category_name ? row.original.category_name : "N/A"}</span>
    ),
  },
  {
    accessorKey: "product_name",
    header: "Product",
    cell: ({ row }) => (
      <span>{row.original.product_name ? row.original.product_name : "N/A"}</span>
    ),
  },
  {
    accessorKey: "valid_until",
    header: "Valid Until",
    cell: ({ row }) => (
      <span>{row.original.valid_until ? new Date(row.original.valid_until).toLocaleDateString() : "No Expiry"}</span>
    ),
  },
  {
    accessorKey: "min_purchase_amount",
    header: "Min Purchase",
    cell: ({ row }) => (
      <span>
        {row.original.applies_to === "min_purchase"
          ? `₱${parseFloat(row.original.min_purchase_amount || 0).toFixed(2)}`
          : "N/A"}
      </span>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex gap-2 justify-center">
        <Button variant="outline" size="icon" onClick={() => handleEdit(row.original)} className="border-border">
          <Edit className="w-4 h-4 text-muted-foreground" />
        </Button>
        <Button variant="destructive" size="icon" onClick={() => handleDelete(row.original.id)}>
          <Trash className="w-4 h-4 text-white" />
        </Button>
      </div>
    ),
  },
];
