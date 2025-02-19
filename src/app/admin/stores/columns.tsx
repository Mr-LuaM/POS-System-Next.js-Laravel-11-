"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Edit, Archive, RefreshCcw, Trash } from "lucide-react";

/**
 * ✅ Define TypeScript Interface for Store Data
 */
export interface Store {
  id: number;
  name: string;
  location?: string;
  deleted_at?: string | null; // ✅ Check if store is archived
}

/**
 * ✅ Store Table Columns (Handles Edit, Archive, Restore, and Delete)
 */
export const getStoreColumns = (
  handleEdit: (store: Store) => void,
  openConfirmDialog: (id: number, type: "archive" | "restore" | "delete") => void
): ColumnDef<Store>[] => [
  {
    accessorKey: "name",
    header: "Store Name",
    cell: ({ row }) => <span className="text-foreground font-medium">{row.original.name}</span>,
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.location || "N/A"}</span>,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const store = row.original;
      const isArchived = !!store.deleted_at; // ✅ Check if archived

      return (
        <div className="flex gap-2 justify-center">
          {/* ✅ Edit Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleEdit(store)}
            className="border-border"
            aria-label="Edit Store"
          >
            <Edit className="w-4 h-4 text-muted-foreground" />
          </Button>

          {/* ✅ Archive or Restore Button */}
          <Button
            variant={isArchived ? "secondary" : "destructive"}
            size="icon"
            onClick={() => openConfirmDialog(store.id, isArchived ? "restore" : "archive")}
            aria-label={isArchived ? "Restore Store" : "Archive Store"}
          >
            {isArchived ? (
              <RefreshCcw className="w-4 h-4 text-green-600" />
            ) : (
              <Archive className="w-4 h-4 text-white" />
            )}
          </Button>

          {/* ✅ Permanent Delete Button (Only if Archived) */}
          {isArchived && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => openConfirmDialog(store.id, "delete")}
              aria-label="Delete Store"
            >
              <Trash className="w-4 h-4 text-red-600" />
            </Button>
          )}
        </div>
      );
    },
  },
];
