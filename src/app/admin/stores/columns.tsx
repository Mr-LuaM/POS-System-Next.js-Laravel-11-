"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";

/**
 * ✅ Store Table Columns (Handles CRUD Actions)
 */
export const getStoreColumns = (
  handleEdit: (store: { id: number; name: string; location?: string }) => void,
  handleDelete: (id: number) => void
): ColumnDef<{ id: number; name: string; location?: string }>[] => [
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
    cell: ({ row }) => (
      <div className="flex gap-2 justify-center">
        <Button variant="outline" size="icon" onClick={() => handleEdit(row.original)} className="border-border">
          <Edit className="w-4 h-4 text-muted-foreground" />
        </Button>
        <Button variant="destructive" size="icon" onClick={() => handleDelete(row.original.id)}>
          <Trash className="w-4 h-4 text-white" />
        </Button>
      </div>
    ),
  },
];
