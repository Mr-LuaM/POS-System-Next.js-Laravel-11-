"use client";

import { ColumnDef } from "@tanstack/react-table";

// Type for Product Breakdown
export type ProductBreakdown = {
  product_name: string;
  total_sold: number;
  refunded_quantity: number;
  net_sold: number;
};

export const getProductBreakdownColumns = (): ColumnDef<ProductBreakdown>[] => [
  {
    accessorKey: "product_name",
    header: "Product Name",
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("product_name")}</span>
    ),
  },
  {
    accessorKey: "total_sold",
    header: "Total Sold",
    cell: ({ row }) => <span>{row.getValue("total_sold")}</span>,
  },
  {
    accessorKey: "refunded_quantity",
    header: "Refunded",
    cell: ({ row }) => (
      <span className="text-red-500 font-medium">
        {row.getValue("refunded_quantity")}
      </span>
    ),
  },
//   {
//     accessorKey: "net_sold",
//     header: "Net Sold",
//     cell: ({ row }) => (
//       <span className="font-semibold text-primary">
//         {row.getValue("net_sold")}
//       </span>
//     ),
//   },
];
