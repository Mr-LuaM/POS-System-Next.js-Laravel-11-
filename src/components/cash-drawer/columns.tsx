"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

/**
 * ✅ Define Cash Drawer Type
 */
export interface CashDrawer {
  cash_drawer_id: number;
  store_id: number;
  cashier_id: number;
  cashier_name: string;
  opening_balance: string | number;
  closing_balance: string | number | null;
  actual_cash_collected?: string | number | null;
  total_collected: string | number;
  total_sales: string | number;
  total_change_given: string | number;
  variance: string | number | null;
  drawer_balance: string | number;
  status: string;
  cash_drawer_date: string;
  shift_date: string;
}

/**
 * ✅ Table Columns for Cash Drawers
 */
export const getCashDrawerColumns = (
  openCashModal: (cashDrawerId: number) => void
): ColumnDef<CashDrawer>[] => [
  {
    accessorKey: "cash_drawer_date",
    header: "Drawer Date",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.cash_drawer_date || "N/A"}</span>
    ),
  },
  {
    accessorKey: "shift_date",
    header: "Shift Date",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.shift_date || "N/A"}</span>
    ),
  },
  {
    accessorKey: "cashier_name",
    header: "Cashier",
    cell: ({ row }) => (
      <span className="text-foreground font-medium">{row.original.cashier_name || "Unknown"}</span>
    ),
  },
  {
    accessorKey: "opening_balance",
    header: "Opening Balance",
    cell: ({ row }) => `₱${Number(row.original.opening_balance || 0).toFixed(2)}`,
  },
  {
    accessorKey: "total_sales",
    header: "Total Sales",
    cell: ({ row }) => `₱${Number(row.original.total_sales || 0).toFixed(2)}`,
  },
  {
    accessorKey: "total_collected",
    header: "Total Collected",
    cell: ({ row }) => `₱${Number(row.original.total_collected || 0).toFixed(2)}`,
  },
  {
    accessorKey: "total_change_given",
    header: "Total Change Given",
    cell: ({ row }) => `₱${Number(row.original.total_change_given || 0).toFixed(2)}`,
  },
  {
    accessorKey: "drawer_balance",
    header: "Drawer Balance",
    cell: ({ row }) => {
      const drawerBalance = Number(row.original.drawer_balance || 0);
      return `₱${drawerBalance.toFixed(2)}`;
    },
  },
  {
    accessorKey: "actual_cash_collected",
    header: "Actual Collected",
    cell: ({ row }) => {
      const actualCollected =
        row.original.actual_cash_collected !== null
          ? `₱${Number(row.original.actual_cash_collected).toFixed(2)}`
          : "N/A";
      return actualCollected;
    },
  },
  {
    accessorKey: "variance",
    header: "Variance",
    cell: ({ row }) => {
      const varianceValue =
        row.original.variance !== null ? `₱${Number(row.original.variance).toFixed(2)}` : "N/A";
      const varianceColor =
        row.original.variance !== null && Number(row.original.variance) < 0
          ? "text-red-600"
          : "text-green-600";

      return <span className={`${varianceColor}`}>{varianceValue}</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const statusColor =
        row.original.status === "Short"
          ? "text-red-600"
          : row.original.status === "Over"
          ? "text-green-600"
          : "text-blue-600";

      return <span className={`font-bold ${statusColor}`}>{row.original.status || "Unknown"}</span>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <Button
        variant="outline"
        size="icon"
        onClick={() => openCashModal(row.original.cash_drawer_id)}
        className="border-border"
        aria-label="Enter Actual Cash"
      >
        <Edit className="w-4 h-4 text-muted-foreground" />
      </Button>
    ),
  },
];
