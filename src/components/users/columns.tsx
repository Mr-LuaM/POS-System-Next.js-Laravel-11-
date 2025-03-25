"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Edit, Trash, RefreshCcw } from "lucide-react";

/**
 * ✅ Full User Type including Store Info
 */
type UserTableRow = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "manager" | "cashier";
  deleted_at?: string | null;
  store_name?: string | null;
};

/**
 * ✅ User Table Columns (With Store & Actions)
 */
export const getUserColumns = (
  handleEdit: (user: UserTableRow) => void,
  openConfirmDialog: (id: number, type: "archive" | "restore" | "delete") => void
): ColumnDef<UserTableRow>[] => [
  {
    accessorKey: "name",
    header: "User Name",
    cell: ({ row }) => (
      <span className="text-foreground font-medium">{row.original.name}</span>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.email}</span>
    ),
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.original.role;
      const roleColor =
        role === "admin"
          ? "bg-red-500"
          : role === "cashier"
          ? "bg-blue-500"
          : "bg-green-500";
      return (
        <span className={`px-2 py-1 rounded text-white text-xs font-semibold ${roleColor}`}>
          {role.toUpperCase()}
        </span>
      );
    },
  },
  {
    accessorKey: "store_name",
    header: "Store",
    cell: ({ row }) => (
      row.original.store_name ? (
        <span>{row.original.store_name}</span>
      ) : (
        <span className="italic text-muted-foreground">—</span>
      )
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
