"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

/**
 * ✅ Sales Table Columns
 */
export const getSalesColumns = ({ onViewSale, onRefundSale, userRole }: { 
  onViewSale: (saleId: number) => void,
  onRefundSale: (saleId: number) => void,
  userRole: string
}): ColumnDef<any>[] => [
  {
    accessorKey: "id",
    header: "Sale ID",
    cell: ({ row }) => <span className="font-medium text-foreground">#{row.original.id}</span>,
  },
  {
    accessorKey: "store_name",
    header: "Store",
    cell: ({ row }) => <span className="font-medium text-foreground">{row.original.store_name}</span>,
  },
  {
    accessorKey: "cashier_name",
    header: "Cashier",
    cell: ({ row }) => <span>{row.original.cashier_name}</span>,
  },
  {
    accessorKey: "customer_name",
    header: "Customer",
    cell: ({ row }) => <span>{row.original.customer_name || "N/A"}</span>,
  },
  {
    accessorKey: "total_amount",
    header: "Total Amount",
    cell: ({ row }) => (
      <span className="font-bold text-green-600">
        ₱{parseFloat(row.original.total_amount).toFixed(2)}
      </span>
    ),
  },
  {
    accessorKey: "payment_methods",
    header: "Payment Methods",
    cell: ({ row }) => (
      <span>{row.original.payment_methods.join(", ")}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status.toLowerCase();
      return (
        <span
          className={`px-2 py-1 rounded-md text-xs font-semibold ${
            status === "completed"
              ? "bg-green-100 text-green-700"
              : status === "pending"
              ? "bg-yellow-100 text-yellow-700"
              : status === "refunded"
              ? "bg-gray-300 text-gray-700" // ✅ Refunded (Gray)
              : "bg-red-100 text-red-700"
          }`}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
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
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const status = row.original.status.toLowerCase();

      return (
        <div className="space-x-2">
          {/* ✅ View Sale Details */}
          <Button
            className="px-3 py-1 text-xs bg-blue-500 text-white hover:bg-blue-600"
            onClick={() => onViewSale(row.original.id)}
          >
            View Details
          </Button>

          {/* ✅ Refund Button (Only for Admin/Manager & Not Refunded) */}
          {["admin", "manager"].includes(userRole) && status !== "refunded" && (
            <Button
              className="px-3 py-1 text-xs bg-red-500 text-white hover:bg-red-600"
              onClick={() => onRefundSale(row.original.id)}
            >
              Refund
            </Button>
          )}
        </div>
      );
    },
  },
];
