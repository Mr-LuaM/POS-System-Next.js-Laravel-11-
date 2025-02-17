"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";

export const categoryColumns: ColumnDef<{ id: number; name: string }>[] = [
  {
    accessorKey: "name",
    header: "Category Name",
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => alert(`Edit ${row.original.name}`)}>
          <Edit className="w-4 h-4" />
        </Button>
        <Button variant="destructive" size="sm" onClick={() => alert(`Delete ${row.original.name}`)}>
          <Trash className="w-4 h-4" />
        </Button>
      </div>
    ),
  },
];
