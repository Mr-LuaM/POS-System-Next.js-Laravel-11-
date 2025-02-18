"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";

/**
 * ✅ User Table Columns (Handles CRUD Actions)
 */
export const getUserColumns = (
  handleEdit: (user: { id: number; name: string; email: string; role: string }) => void,
  handleDelete: (id: number) => void
): ColumnDef<{ id: number; name: string; email: string; role: string }>[] => [
  {
    accessorKey: "name",
    header: "User Name",
    cell: ({ row }) => <span className="text-foreground font-medium">{row.original.name}</span>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.email}</span>,
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <span
        className={`px-2 py-1 rounded ${
          row.original.role === "admin" ? "bg-red-500 text-white" :
          row.original.role === "cashier" ? "bg-blue-500 text-white" :
          "bg-green-500 text-white"
        }`}
      >
        {row.original.role.toUpperCase()}
      </span>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex gap-2 justify-center">
        {/* ✅ Edit Button */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleEdit(row.original)}
          className="border-border"
          aria-label="Edit User"
        >
          <Edit className="w-4 h-4 text-muted-foreground" />
        </Button>

        {/* ✅ Delete Button */}
        <Button
          variant="destructive"
          size="icon"
          onClick={() => handleDelete(row.original.id)}
          aria-label="Delete User"
        >
          <Trash className="w-4 h-4 text-white" />
        </Button>
      </div>
    ),
  },
];
