"use client";

import { useInventory } from "@/hooks/useInventory";
import { useState } from "react";
import { DataTable } from "@/components/common/data-table";
import { getInventoryColumns } from "./columns";
import ConfirmDialog from "@/components/common/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"; // ✅ Active/Archived toggle

/**
 * ✅ Inventory Table (Handles Full CRUD & Archive)
 */
export default function InventoryTable() {
  const {
    inventory,
    loading,
    handleArchiveProduct,
    handleRestoreProduct,
    refreshInventory,
    archivedFilter,
    setArchivedFilter,
  } = useInventory();

  const [confirmDialog, setConfirmDialog] = useState<{ id: number; type: "archive" | "restore" } | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  /**
   * ✅ Format Inventory Data (Flatten Nested Properties)
   */
  const formattedInventory = inventory.map((item) => ({
    ...item,
    productName: item.product?.name || "N/A",
    productSKU: item.product?.sku || "N/A",
    productBarcode: item.product?.barcode || "N/A",
    storeName: item.store?.name || "N/A",
  }));

  /**
   * ✅ Open Confirm Dialog
   */
  const openConfirmDialog = (id: number, type: "archive" | "restore") => {
    setConfirmDialog({ id, type });
  };

  /**
   * ✅ Handle Confirm Action
   */
  const handleConfirmAction = async () => {
    if (!confirmDialog) return;
    setConfirmLoading(true);

    try {
      if (confirmDialog.type === "archive") {
        await handleArchiveProduct(confirmDialog.id);
      } else if (confirmDialog.type === "restore") {
        await handleRestoreProduct(confirmDialog.id);
      }
    } catch (error) {
      console.error("Error processing action:", error);
    } finally {
      setConfirmDialog(null);
      setConfirmLoading(false);
    }
  };

  return (
    <div className="w-full p-6 space-y-6">
      {/* ✅ Page Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">Inventory</h1>
        <Button onClick={refreshInventory} className="px-4 py-2">Refresh</Button>
      </div>

      {/* ✅ Toggle Active/Archived Products */}
      <div className="flex justify-end">
        <ToggleGroup
          type="single"
          value={archivedFilter === "true" ? "archived" : archivedFilter === "false" ? "active" : "all"}
          onValueChange={(value) => setArchivedFilter(value === "archived" ? "true" : value === "active" ? "false" : null)}
          className="mb-4"
        >
          <ToggleGroupItem value="all">All Products</ToggleGroupItem>
          <ToggleGroupItem value="active">Active Products</ToggleGroupItem>
          <ToggleGroupItem value="archived">Archived Products</ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* ✅ DataTable with Loading Skeleton */}
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : (
        <div className="w-full max-w-none px-0">
          <DataTable
            columns={getInventoryColumns(() => {}, openConfirmDialog)}
            data={formattedInventory} // ✅ Use the flattened data
            searchKeys={["productName", "productSKU", "productBarcode", "storeName"]} // ✅ Search works across multiple columns
          />
        </div>
      )}

      {/* ✅ Confirm Dialog */}
      {confirmDialog && (
        <ConfirmDialog
          key={confirmDialog.id}
          open={true}
          onConfirm={handleConfirmAction}
          onCancel={() => setConfirmDialog(null)}
          title={
            confirmDialog.type === "archive"
              ? "Archive Product"
              : "Restore Product"
          }
          description={
            confirmDialog.type === "archive"
              ? "Are you sure you want to archive this product?"
              : "Are you sure you want to restore this product?"
          }
          confirmLabel={confirmDialog.type === "archive" ? "Archive" : "Restore"}
          cancelLabel="Cancel"
          confirmVariant={confirmDialog.type === "archive" ? "outline" : "secondary"}
          loading={confirmLoading}
        />
      )}
    </div>
  );
}
