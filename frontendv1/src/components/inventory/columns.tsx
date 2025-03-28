"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical, Archive, Pencil, Info, RotateCcw, Warehouse, Settings } from "lucide-react";

/**
 * ✅ Inventory Table Columns (Supports General, Admin, & Store-Level Management)
 */
export function getInventoryColumns(
  role: "admin" | "manager",
  onEdit: (id: number) => void,
  onViewDetails: (id: number) => void,
  onGlobalArchive: (id: number, type: "archive" | "restore") => void,
  onStoreArchive: (id: number, type: "archive" | "restore") => void,
  onManageStock: (id: number, storeId: number) => void, // ✅ Store-Level Stock
  onManageStoreDetails: (id: number, storeId: number) => void, // ✅ Store-Level Pricing
  onHardDelete: (id: number) => void,

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
            variant={isGloballyArchived ? "destructive" : isStoreArchived ? "warning" : "default"}
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
        const isGloballyArchived = row.original?.product_deleted_at !== null;
        const isStoreArchived = row.original?.deleted_at !== null;
    
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {/* ✅ View Details */}
              <DropdownMenuItem onClick={() => onViewDetails(row.original.id)}>
                <Info className="w-4 h-4 mr-2" />
                View Details
              </DropdownMenuItem>
    
              {/* ❌ Disable store-level actions if globally archived */}
              {!isGloballyArchived && (
                <>
                  {/* ✅ Store-Level: Manage Stock (Admin & Manager) */}
                  <DropdownMenuItem onClick={() => onManageStock(row.original.id, row.original.storeId)}>
                    <Warehouse className="w-4 h-4 mr-2" />
                    Manage Stock
                  </DropdownMenuItem>
    
                  {/* ✅ Store-Level: Manage Price & Threshold (Admin Only) */}
                  {role === "admin" && (
                    <DropdownMenuItem onClick={() => onManageStoreDetails(row.original.id, row.original.storeId)}>
                      <Settings className="w-4 h-4 mr-2 text-yellow-600" />
                      Manage Store-Level Details
                    </DropdownMenuItem>
                  )}
    
                  {/* ✅ Edit Product (Admin Only) */}
                  {role === "admin" && (
                    <DropdownMenuItem onClick={() => onEdit(row.original.id)}>
                      <Pencil className="w-4 h-4 mr-2 text-blue-600" />
                      Edit Product
                    </DropdownMenuItem>
                  )}
    
                  {/* ✅ Store-Level Archive/Restore (Admin & Manager) */}
                  <DropdownMenuItem
                    onClick={() => onStoreArchive(row.original.id, isStoreArchived ? "restore" : "archive")}
                  >
                    {isStoreArchived ? (
                      <>
                        <RotateCcw className="w-4 h-4 mr-2 text-green-600" />
                        Restore in Store
                      </>
                    ) : (
                      <>
                        <Archive className="w-4 h-4 mr-2 text-red-600" />
                        Archive in Store
                      </>
                    )}
                  </DropdownMenuItem>
                </>
              )}
    
              {/* ✅ Global Archive/Restore (Admin Only) */}
              {role === "admin" && (
                <DropdownMenuItem
                  onClick={() => onGlobalArchive(row.original.productID, isGloballyArchived ? "restore" : "archive")}
                >
                  {isGloballyArchived ? (
                    <>
                      <RotateCcw className="w-4 h-4 mr-2 text-green-600" />
                      Restore Globally
                    </>
                  ) : (
                    <>
                      <Archive className="w-4 h-4 mr-2 text-red-600" />
                      Archive Globally
                    </>
                  )}
                </DropdownMenuItem>
              )}
    
              {/* ✅ Hard Delete (Only When Globally Archived) */}
              {role === "admin" && isGloballyArchived && (
                <DropdownMenuItem
                  onClick={() => onHardDelete(row.original.productID)}
                  className="text-red-600"
                >
                  <Archive className="w-4 h-4 mr-2 text-red-600" />
                  Delete Permanently
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
    
  ];
}
