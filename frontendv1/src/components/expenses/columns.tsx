"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Edit, Trash2 } from "lucide-react";

/**
 * ✅ Expense Data Type (Matches API Response)
 */
export type Expense = {
  id: number;
  store_name: string;
  description: string;
  amount: number;
  expense_date: string;
};

/**
 * ✅ Define Table Columns
 */
export const getExpenseColumns = (
  onEdit: (expense: Expense) => void,
  onDelete: (id: number) => void
): ColumnDef<Expense>[] => [
  {
    accessorKey: "store_name",
    header: "Store",
    cell: ({ row }) => <span className="font-medium">{row.getValue("store_name")}</span>,
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => <span>{row.getValue("description")}</span>,
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => (
      <span className="font-semibold text-red-600">
        ₱{parseFloat(row.getValue("amount")).toFixed(2)}
      </span>
    ),
  },
  {
    accessorKey: "expense_date",
    header: "Date",
    cell: ({ row }) => <span>{row.getValue("expense_date")}</span>,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const expense = row.original;
      return (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(expense)}
            className="flex items-center space-x-1"
          >
            <Edit size={16} />
            <span>Edit</span>
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(expense.id)}
            className="flex items-center space-x-1"
          >
            <Trash2 size={16} />
            <span>Delete</span>
          </Button>
        </div>
      );
    },
  },
];
