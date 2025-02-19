"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Edit, Archive, RefreshCcw, Trash, Package } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export interface Store {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Supplier {
  id: number;
  name: string;
  contact?: string;
  email?: string;
  address?: string;
}

export interface StoreProduct {
  id: number;
  store_id: number;
  product_id: number;
  price: number;
  stock_quantity: number;
  low_stock_threshold: number;
  deleted_at?: string | null;
  product?: {
    id: number;
    name: string;
    sku: string;
    barcode?: string;
    qr_code?: string;
    category_id?: number;
    supplier_id?: number;
    category?: Category;
    supplier?: Supplier;
  };
  store?: Store;
}

/**
 * ✅ Store-Specific Product Table Columns
 */
export const getProductColumns = (
  handleEdit: (product: StoreProduct) => void,
  openConfirmDialog: (id: number, type: "archive" | "restore" | "delete") => void,
  openManageStock: (product: StoreProduct) => void
): ColumnDef<StoreProduct>[] => [
  {
    accessorKey: "store.name",
    header: "Store",
    cell: ({ row }) => <span className="font-medium">{row.original.store?.name || "—"}</span>,
  },
  {
    accessorKey: "product.name",
    header: "Product Name",
    cell: ({ row }) => <span className="font-medium">{row.original.product?.name || "—"}</span>,
  },
  {
    accessorKey: "product.sku",
    header: "SKU",
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.product?.sku || "—"}</span>,
  },
  {
    accessorKey: "product.category.name",
    header: "Category",
    cell: ({ row }) => <span>{row.original.product?.category?.name || "—"}</span>,
  },
  {
    accessorKey: "product.supplier.name",
    header: "Supplier",
    cell: ({ row }) => <span>{row.original.product?.supplier?.name || "—"}</span>,
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => `₱${row.original.price.toFixed(2)}`,
  },
  {
    accessorKey: "stock_quantity",
    header: "Stock",
    cell: ({ row }) => {
      const { stock_quantity, low_stock_threshold } = row.original;
      return (
        <span className={stock_quantity <= low_stock_threshold ? "text-red-500 font-semibold" : ""}>
          {stock_quantity}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const isArchived = !!row.original.deleted_at;
      return (
        <span className={isArchived ? "text-red-500 font-semibold" : "text-green-600 font-semibold"}>
          {isArchived ? "Archived" : "Active"}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const product = row.original;
      const isArchived = !!product.deleted_at;

      return (
        <TooltipProvider>
          <div className="flex gap-2">
            {/* ✅ Edit Product */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={() => handleEdit(product)}>
                  <Edit className="w-4 h-4 text-muted-foreground" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Edit Product</TooltipContent>
            </Tooltip>

            {/* ✅ Manage Stock */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="secondary" size="icon" onClick={() => openManageStock(product)}>
                  <Package className="w-4 h-4 text-blue-500" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Manage Stock</TooltipContent>
            </Tooltip>

            {/* ✅ Archive or Restore */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={isArchived ? "secondary" : "destructive"}
                  size="icon"
                  onClick={() => openConfirmDialog(product.id, isArchived ? "restore" : "archive")}
                >
                  {isArchived ? <RefreshCcw className="w-4 h-4 text-green-600" /> : <Archive className="w-4 h-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{isArchived ? "Restore Product" : "Archive Product"}</TooltipContent>
            </Tooltip>

            {/* ✅ Permanent Delete (Only if Archived) */}
            {isArchived && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={() => openConfirmDialog(product.id, "delete")}>
                    <Trash className="w-4 h-4 text-red-600" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Delete Product</TooltipContent>
              </Tooltip>
            )}
          </div>
        </TooltipProvider>
      );
    },
  },
];
