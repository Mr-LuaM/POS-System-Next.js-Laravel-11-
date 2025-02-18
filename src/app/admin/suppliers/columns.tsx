"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";

/**
 * ✅ Define TypeScript Interface for Supplier Data
 */
export interface Supplier {
  id: number;
  name: string;
  contact: string;
  email?: string;
  address?: string;
}

/**
 * ✅ Supplier Table Columns (Handles CRUD Actions)
 */
export const getSupplierColumns = (
  handleEdit: (supplier: Supplier) => void,
  handleDelete: (id: number) => void
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
    cell: ({ row }) => (
      <div className="flex gap-2 justify-center">
        <Button variant="outline" size="icon" onClick={() => handleEdit(row.original)} className="border-border" aria-label="Edit Supplier">
          <Edit className="w-4 h-4 text-muted-foreground" />
        </Button>
        <Button variant="destructive" size="icon" onClick={() => handleDelete(row.original.id)} aria-label="Delete Supplier">
          <Trash className="w-4 h-4 text-white" />
        </Button>
      </div>
    ),
  },
];
