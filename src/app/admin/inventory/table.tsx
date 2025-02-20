"use client";

import { useInventory } from "@/hooks/useInventory";
import { useState, useEffect } from "react";
import { DataTable } from "@/components/common/data-table";
import { getInventoryColumns } from "./columns";
import InventoryModal from "./inventory-modal";
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
    saveProduct,
    updateStock,
    handleArchiveProduct,
    handleRestoreProduct,
    handleDeleteProduct,
    fetchLowStockProducts,
    archivedFilter,
    setArchivedFilter,
  } = useInventory();

  const [productData, setProductData] = useState<{ id?: number; name: string; price: number; stock_quantity: number } | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{ id: number; type: "archive" | "restore" | "delete" } | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  /**
   * ✅ Open Add Product Modal
   */
  const openAddModal = () => {
    setProductData(null);
    setModalOpen(true);
  };

  /**
   * ✅ Open Edit Product Modal
   */
  const openEditModal = (product: InventoryProduct) => {
    setProductData(product);
    setModalOpen(true);
  };

  /**
   * ✅ Open Confirm Dialog
   */
  const openConfirmDialog = (id: number, type: "archive" | "restore" | "delete") => {
    setConfirmDialog({ id, type });
  };

  /**
   * ✅ Handle Add or Update Product Submission
   */
  const handleSubmitProduct = async (data: Partial<InventoryProduct>) => {
    const success = await saveProduct(data, productData?.id);
    if (success) {
      setModalOpen(false);
    }
  };

  /**
   * ✅ Handle Archive, Restore, or Delete Confirmation with Loading
   */
  const handleConfirmAction = async () => {
    if (!confirmDialog) return;

    setConfirmLoading(true);
    try {
      if (confirmDialog.type === "archive") {
        await handleArchiveProduct(confirmDialog.id);
      } else if (confirmDialog.type === "restore") {
        await handleRestoreProduct(confirmDialog.id);
      } else if (confirmDialog.type === "delete") {
        await handleDeleteProduct(confirmDialog.id);
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
        <Button onClick={openAddModal} className="px-4 py-2">+ Add Product</Button>
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
            columns={getInventoryColumns(openEditModal, openConfirmDialog)}
            data={inventory}
            searchKey="product.name"
          />
        </div>
      )}

      {/* ✅ Inventory Modal */}
      <InventoryModal 
        isOpen={isModalOpen} 
        onClose={() => setModalOpen(false)} 
        onSubmit={handleSubmitProduct} 
        productData={productData || undefined} 
      />

      {/* ✅ Confirm Dialog with Loading */}
      {confirmDialog && (
        <ConfirmDialog
          key={confirmDialog.id}
          open={true}
          onConfirm={handleConfirmAction}
          onCancel={() => setConfirmDialog(null)}
          title={
            confirmDialog.type === "archive"
              ? "Archive Product"
              : confirmDialog.type === "restore"
              ? "Restore Product"
              : "Delete Product"
          }
          description={
            confirmDialog.type === "archive"
              ? "Are you sure you want to archive this product? You can restore it later."
              : confirmDialog.type === "restore"
              ? "Are you sure you want to restore this product?"
              : "Are you sure you want to permanently delete this product? This action cannot be undone."
          }
          confirmLabel={
            confirmDialog.type === "archive"
              ? "Archive"
              : confirmDialog.type === "restore"
              ? "Restore"
              : "Delete"
          }
          cancelLabel="Cancel"
          confirmVariant={
            confirmDialog.type === "archive"
              ? "outline"
              : confirmDialog.type === "restore"
              ? "secondary"
              : "destructive"
          }
          loading={confirmLoading}
        />
      )}
    </div>
  );
}
