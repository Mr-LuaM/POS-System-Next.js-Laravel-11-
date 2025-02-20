"use client";

import { useInventory } from "@/hooks/useInventory";
import { useCategories } from "@/hooks/useCategories";
import { useSuppliers } from "@/hooks/useSuppliers";
import { useStores } from "@/hooks/useStores";
import { useState } from "react";
import { DataTable } from "@/components/common/data-table";
import { getInventoryColumns } from "./columns";
import ConfirmDialog from "@/components/common/confirm-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import ProductDetailsModal from "./details-modal";
import InventoryModal from "./inventory-modal"; // ✅ Import Inventory Modal
import { Button } from "@/components/ui/button";

/**
 * ✅ Inventory Table (Handles Full CRUD & Archive)
 */
export default function InventoryTable({ role }: { role: "admin" | "manager" }) {
  const {
    inventory,
    loading,
    handleArchiveProduct,
    handleRestoreProduct,
    archivedFilter,
    setArchivedFilter,
    addInventory,
    editInventory,
    refreshInventory, // ✅ Ensure correct refresh handling
  } = useInventory();

  const { categories } = useCategories();
  const { suppliers } = useSuppliers();
  const { stores } = useStores();

  const [confirmDialog, setConfirmDialog] = useState<{ id: number; type: "archive" | "restore" } | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isInventoryModalOpen, setInventoryModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<any | null>(null);

  /**
   * ✅ Format Inventory Data (Flatten Nested Properties)
   */
  const formattedInventory = inventory.map((item) => ({
    id: item.id,
    productName: item.product?.name ?? "Unnamed Product",
    productSKU: item.product?.sku ?? "N/A",
    categoryName: item.product?.category?.name ?? "N/A",
    supplier: item.product?.supplier ?? null,
    supplierName: item.product?.supplier?.name ?? "N/A",
    store: item.store ?? null,
    storeName: item.store?.name ?? "N/A",
    storeLocation: item.store?.location ?? "N/A",
    price: item.price ?? 0,
    stock: item.stock_quantity ?? 0,
    low_stock_threshold: item.low_stock_threshold ?? 0,
    barcode: item.product?.barcode ?? null,
    qr_code: item.product?.qr_code ?? null,
    created_at: item.created_at ?? "N/A",
    updated_at: item.updated_at ?? "N/A",
    deleted_at: item.deleted_at ?? null,
    product_deleted_at: item.product?.deleted_at ?? null,
  }));

  /**
   * ✅ Open Product Details Modal
   */
  const handleViewDetails = (productId: number) => {
    const product = formattedInventory.find((p) => p.id === productId);
    if (product) {
      setSelectedProduct(product);
      setIsDetailsOpen(true);
    }
  };

  /**
   * ✅ Open Edit Inventory Modal (Fix Category & Supplier Matching)
   */
  const handleEditProduct = (productId: number) => {
    const product = formattedInventory.find((p) => p.id === productId);
    if (product) {
      // Match category and supplier by ID
      const matchedCategory = categories.find(cat => cat.name === product.categoryName);
      const matchedSupplier = suppliers.find(sup => sup.name === product.supplierName);

      setEditProduct({
        ...product,
        category_id: matchedCategory ? matchedCategory.id.toString() : "other",
        supplier_id: matchedSupplier ? matchedSupplier.id.toString() : "other",
        new_category: matchedCategory ? "" : product.categoryName,
        new_supplier: matchedSupplier ? "" : product.supplierName,
      });

      setInventoryModalOpen(true);
    }
  };

  /**
   * ✅ Open Confirm Dialog (Archive/Restore)
   */
  const openConfirmDialog = (id: number, type: "archive" | "restore") => {
    setConfirmDialog({ id, type });
  };

  /**
   * ✅ Handle Confirm Action (Archive/Restore)
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
      refreshInventory(); // ✅ Ensure the table refreshes
    } catch (error) {
      console.error("Error processing action:", error);
    } finally {
      setConfirmDialog(null);
      setConfirmLoading(false);
    }
  };

  /**
   * ✅ Handle Add/Edit Submission
   */
  const handleInventorySubmit = async (data: any) => {
    let success = false;
    if (editProduct) {
      success = await editInventory(editProduct.id, data);
    } else {
      success = await addInventory(data);
    }

    if (success) {
      setInventoryModalOpen(false);
      setEditProduct(null);
      refreshInventory(); // ✅ Ensure the table refreshes
    }
    return success;
  };

  return (
    <div className="w-full p-6 space-y-6">
      {/* ✅ Page Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">Inventory</h1>
        <Button onClick={() => setInventoryModalOpen(true)}>+ Add Product</Button>
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
        <Skeleton className="h-10 w-full" />
      ) : (
        <DataTable
          columns={getInventoryColumns(role, handleEditProduct, handleViewDetails, openConfirmDialog)}
          data={formattedInventory}
          searchKeys={["productName", "productSKU", "storeName", "categoryName", "supplierName"]}
          defaultPageSize={5}
          pagination
          sorting
        />
      )}

      {/* ✅ Product Details Modal */}
      {selectedProduct && (
        <ProductDetailsModal open={isDetailsOpen} onClose={() => setIsDetailsOpen(false)} product={selectedProduct} />
      )}

      {/* ✅ Inventory Add/Edit Modal */}
      {isInventoryModalOpen && (
        <InventoryModal
          isOpen={isInventoryModalOpen}
          onClose={() => {
            setInventoryModalOpen(false);
            setEditProduct(null);
          }}
          onSubmit={handleInventorySubmit}
          inventoryData={editProduct}
          categories={categories}
          suppliers={suppliers}
          stores={stores}
        />
      )}

      {/* ✅ Confirm Dialog */}
      {confirmDialog && (
        <ConfirmDialog
          key={confirmDialog.id}
          open={true}
          onConfirm={handleConfirmAction}
          onCancel={() => setConfirmDialog(null)}
          title={confirmDialog.type === "archive" ? "Archive Product" : "Restore Product"}
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
