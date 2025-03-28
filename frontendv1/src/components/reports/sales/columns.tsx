"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

// Define the Best-Selling Products Table Type
export type BestSellingProduct = {
  product_name: string;
  total_sold: number;
  sale_amount: number;
};

// Define the Table Columns
export const getSalesReportColumns = (): ColumnDef<BestSellingProduct>[] => [
  {
    accessorKey: "product_name",
    header: "Product Name",
    cell: ({ row }) => <span className="font-medium">{row.getValue("product_name")}</span>,
  },
  {
    accessorKey: "total_sold",
    header: "Total Sold",
    cell: ({ row }) => <span className="text-center">{row.getValue("total_sold")}</span>,
  },
  {
    accessorKey: "sale_amount",
    header: ({ column }) => (
      <div
        role="button"
        className="cursor-pointer flex items-center gap-2 font-medium"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Sale Amount <ArrowUpDown className="ml-2 h-4 w-4" />
      </div>
    ),
    cell: ({ row }) => (
      <span className="font-semibold text-green-600">
        ₱{row.getValue("sale_amount") ?? "0.00"}
      </span>
    ),
  }
];
