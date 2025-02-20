"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Archive, Pencil, Info, RotateCcw } from "lucide-react";

export function getInventoryColumns(
  role: "admin" | "manager",
  onEdit: (id: number) => void,
  onViewDetails: (id: number) => void,
  onArchiveRestore: (id: number, type: "archive" | "restore") => void
): ColumnDef<any>[] {
  return [
    {
      accessorKey: "productName",
      header: "Product Name",
      cell: ({ row }) => <span className="font-medium">{row.original.productName}</span>,
    },
    {
      accessorKey: "productSKU",
      header: "SKU",
      cell: ({ row }) => <span className="text-muted-foreground">{row.original.productSKU}</span>,
    },
    {
      accessorKey: "categoryName",
      header: "Category",
      cell: ({ row }) => <span>{row.original.categoryName}</span>,
    },
    {
      accessorKey: "storeName",
      header: "Store",
      cell: ({ row }) => <span>{row.original.storeName}</span>,
    },
    {
      accessorKey: "supplierName",
      header: "Supplier",
      cell: ({ row }) => <span>{row.original.supplierName}</span>,
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => (
        <span className="font-semibold text-primary">₱{row.original.price}</span>
      ),
    },
    {
      accessorKey: "stock",
      header: "Stock",
      cell: ({ row }) => (
        <Badge variant={row.original.stock > 0 ? "default" : "destructive"}>
          {row.original.stock > 0 ? `${row.original.stock} pcs` : "Out of Stock"}
        </Badge>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const isGloballyArchived = row.original?.product_deleted_at !== null;
        const isStoreArchived = row.original?.deleted_at !== null;

        return (
          <Badge
            variant={
              isGloballyArchived
                ? "destructive"
                : isStoreArchived
                ? "warning"
                : "default"
            }
          >
            {isGloballyArchived
              ? "Globally Archived"
              : isStoreArchived
              ? "Store Archived"
              : "Active"}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const isArchived = row.original.deleted_at !== null;

        return (
          <div className="flex gap-2">
            {/* View Details */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="outline" onClick={() => onViewDetails(row.original.id)}>
                  <Info className="w-4 h-4 text-muted-foreground" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>View Details</TooltipContent>
            </Tooltip>

            {/* Edit (Only for Admins) */}
            {role === "admin" && !isArchived && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="outline" onClick={() => onEdit(row.original.id)}>
                    <Pencil className="w-4 h-4 text-blue-600" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Edit Product</TooltipContent>
              </Tooltip>
            )}

            {/* Archive/Restore (Only for Admins) */}
            {role === "admin" && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => onArchiveRestore(row.original.id, isArchived ? "restore" : "archive")}
                  >
                    {isArchived ? (
                      <RotateCcw className="w-4 h-4 text-green-600" />
                    ) : (
                      <Archive className="w-4 h-4 text-red-600" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{isArchived ? "Restore Product" : "Archive Product"}</TooltipContent>
              </Tooltip>
            )}
          </div>
        );
      },
    },
  ];
}
