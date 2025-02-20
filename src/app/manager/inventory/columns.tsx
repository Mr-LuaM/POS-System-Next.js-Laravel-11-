import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { InventoryProduct } from "@/services/inventory";

/**
 * ✅ Defines columns for Inventory Data Table
 */
export const getInventoryColumns = (
  openEditModal: (product: InventoryProduct) => void,
  openConfirmDialog: (id: number, type: "archive" | "restore") => void
): ColumnDef<InventoryProduct>[] => [
  {
    accessorKey: "productName",
    header: "Product Name",
    cell: ({ row }) => <span>{row.original.product?.name ?? "N/A"}</span>,
  },
  {
    accessorKey: "productSKU",
    header: "SKU",
    cell: ({ row }) => <span>{row.original.product?.sku ?? "N/A"}</span>,
  },
  {
    accessorKey: "productBarcode",
    header: "Barcode",
    cell: ({ row }) => <span>{row.original.product?.barcode ?? "N/A"}</span>,
  },
  {
    accessorKey: "storeName",
    header: "Store",
    cell: ({ row }) => <span>{row.original.store?.name ?? "N/A"}</span>,
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => (
      <span>₱{parseFloat(row.original.price).toLocaleString("en-PH", { minimumFractionDigits: 2 })}</span>
    ),
  },
  {
    accessorKey: "stockQuantity",
    header: "Stock Quantity",
    cell: ({ row }) => (
      <span className={row.original.stock_quantity <= (row.original.low_stock_threshold || 0) ? "text-red-500 font-bold" : ""}>
        {row.original.stock_quantity} pcs
      </span>
    ),
  },
  {
    accessorKey: "lowStockThreshold",
    header: "Low Stock Threshold",
    cell: ({ row }) => <span>{row.original.low_stock_threshold ?? "N/A"} pcs</span>,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <Button size="sm" onClick={() => openEditModal(row.original)}>Edit</Button>
        {row.original.deleted_at ? (
          <Button size="sm" variant="secondary" onClick={() => openConfirmDialog(row.original.id, "restore")}>Restore</Button>
        ) : (
          <Button size="sm" variant="destructive" onClick={() => openConfirmDialog(row.original.id, "archive")}>Archive</Button>
        )}
      </div>
    ),
  },
];
