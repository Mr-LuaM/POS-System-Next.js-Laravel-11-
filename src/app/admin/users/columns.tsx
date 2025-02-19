"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Edit, Trash, RefreshCcw } from "lucide-react";

/**
 * ✅ User Table Columns (Handles CRUD & Archive Actions)
 */
export const getUserColumns = (
  handleEdit: (user: { id: number; name: string; email: string; role: string }) => void,
  openConfirmDialog: (id: number, type: "archive" | "restore" | "delete") => void
): ColumnDef<{ id: number; name: string; email: string; role: string; deleted_at?: string | null }>[] => [
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
    cell: ({ row }) => {
      const user = row.original;
      const isArchived = !!user.deleted_at;

      return (
        <div className="flex gap-2 justify-center">
          {/* ✅ Edit Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleEdit(user)}
            className="border-border"
            aria-label="Edit User"
          >
            <Edit className="w-4 h-4 text-muted-foreground" />
          </Button>

          {/* ✅ Archive or Restore Button */}
          <Button
            variant={isArchived ? "secondary" : "destructive"}
            size="icon"
            onClick={() => openConfirmDialog(user.id, isArchived ? "restore" : "archive")}
            aria-label={isArchived ? "Restore User" : "Archive User"}
          >
            {isArchived ? (
              <RefreshCcw className="w-4 h-4 text-green-600" />
            ) : (
              <Trash className="w-4 h-4 text-white" />
            )}
          </Button>

          {/* ✅ Permanent Delete Button (Only if Archived) */}
          {isArchived && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => openConfirmDialog(user.id, "delete")}
              aria-label="Delete User"
            >
              <Trash className="w-4 h-4 text-red-600" />
            </Button>
          )}
        </div>
      );
    },
  },
];
