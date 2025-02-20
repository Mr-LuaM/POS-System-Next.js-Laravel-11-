"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Edit, Archive, RefreshCcw, Trash } from "lucide-react";

/**
 * ✅ Define TypeScript Interface for Inventory Product Data
 */
export interface InventoryProduct {
  id: number;
  store_id: number;
  product_id: number;
  price: number;
  stock_quantity: number;
  low_stock_threshold?: number;
  deleted_at?: string | null; // ✅ Check if product is archived
  product: {
    id: number;
    name: string;
    sku: string;
    barcode?: string;
    qr_code?: string;
    category_id?: number;
    supplier_id?: number;
    category?: {
      id: number;
      name: string;
    };
    supplier?: {
      id: number;
      name: string;
    };
  };
}

/**
 * ✅ Inventory Table Columns (Handles Edit, Archive, Restore, and Delete)
 */
export const getInventoryColumns = (
  handleEdit: (product: InventoryProduct) => void,
  openConfirmDialog: (id: number, type: "archive" | "restore" | "delete") => void
): ColumnDef<InventoryProduct>[] => [
  {
    accessorKey: "product.name", // Access product.name correctly from the nested product object
    header: "Product Name",
    cell: ({ row }) => <span className="text-foreground font-medium">{row.original.product.name}</span>,
  },
  {
    accessorKey: "product.sku", // Access SKU correctly from the nested product object
    header: "SKU",
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.product.sku}</span>,
  },
  {
    accessorKey: "price", // Directly access price
    header: "Price",
    cell: ({ row }) => <span className="text-muted-foreground">${row.original.price.toFixed(2)}</span>,
  },
  {
    accessorKey: "stock_quantity", // Directly access stock_quantity
    header: "Stock Quantity",
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.stock_quantity}</span>,
  },
  {
    accessorKey: "low_stock_threshold", // Access low_stock_threshold
    header: "Low Stock Threshold",
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.low_stock_threshold || "N/A"}</span>,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const product = row.original;
      const isArchived = !!product.deleted_at; // ✅ Check if archived

      return (
        <div className="flex gap-2 justify-center">
          {/* ✅ Edit Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleEdit(product)}
            className="border-border"
            aria-label="Edit Product"
          >
            <Edit className="w-4 h-4 text-muted-foreground" />
          </Button>

          {/* ✅ Archive or Restore Button */}
          <Button
            variant={isArchived ? "secondary" : "destructive"}
            size="icon"
            onClick={() => openConfirmDialog(product.id, isArchived ? "restore" : "archive")}
            aria-label={isArchived ? "Restore Product" : "Archive Product"}
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
              onClick={() => openConfirmDialog(product.id, "delete")}
              aria-label="Delete Product"
            >
              <Trash className="w-4 h-4 text-red-600" />
            </Button>
          )}
        </div>
      );
    },
  },
];
