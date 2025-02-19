"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Edit, Archive, RefreshCcw, Trash } from "lucide-react";

/**
 * ✅ Define TypeScript Interface for Supplier Data
 */
export interface Supplier {
  id: number;
  name: string;
  contact: string;
  email?: string;
  address?: string;
  deleted_at?: string | null; // ✅ Check if supplier is archived
}

/**
 * ✅ Supplier Table Columns (Handles Edit, Archive, Restore, and Delete)
 */
export const getSupplierColumns = (
  handleEdit: (supplier: Supplier) => void,
  openConfirmDialog: (id: number, type: "archive" | "restore" | "delete") => void
): ColumnDef<Supplier>[] => [
  {
    accessorKey: "name",
    header: "Supplier Name",
    cell: ({ row }) => <span className="text-foreground font-medium">{row.original.name}</span>,
  },
  {
    accessorKey: "contact",
    header: "Contact",
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.contact}</span>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.email || "N/A"}</span>,
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.address || "N/A"}</span>,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const supplier = row.original;
      const isArchived = !!supplier.deleted_at; // ✅ Check if archived

      return (
        <div className="flex gap-2 justify-center">
          {/* ✅ Edit Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleEdit(supplier)}
            className="border-border"
            aria-label="Edit Supplier"
          >
            <Edit className="w-4 h-4 text-muted-foreground" />
          </Button>

          {/* ✅ Archive or Restore Button (Now Triggers Confirm Dialog) */}
          <Button
            variant={isArchived ? "secondary" : "destructive"}
            size="icon"
            onClick={() => openConfirmDialog(supplier.id, isArchived ? "restore" : "archive")} // ✅ Open Confirm Dialog
            aria-label={isArchived ? "Restore Supplier" : "Archive Supplier"}
          >
            {isArchived ? (
              <RefreshCcw className="w-4 h-4 text-green-600" /> // ✅ Restore Icon
            ) : (
              <Archive className="w-4 h-4 text-white" /> // ✅ Archive Icon
            )}
          </Button>

          {/* ✅ Permanent Delete Button (Only if Archived) */}
          {isArchived && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => openConfirmDialog(supplier.id, "delete")} // ✅ Open Confirm Dialog for Delete
              aria-label="Delete Supplier"
            >
              <Trash className="w-4 h-4 text-red-600" />
            </Button>
          )}
        </div>
      );
    },
  },
];
