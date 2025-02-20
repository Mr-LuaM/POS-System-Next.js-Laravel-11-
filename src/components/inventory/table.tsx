"use client";

import { useInventory } from "@/hooks/useInventory";
import { useState } from "react";
import { DataTable } from "@/components/common/data-table";
import { getInventoryColumns } from "./columns";
import ConfirmDialog from "@/components/common/confirm-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import ProductDetailsModal from "./details-modal";
import InventoryModal from "./inventory-modal"; // ✅ Import Inventory Modal
import { Button } from "@/components/ui/button"; // ✅ Fix missing import

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
  } = useInventory();

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
    supplier: item.product?.supplier ?? null, // ✅ Ensure supplier object is included
    supplierName: item.product?.supplier?.name ?? "N/A", // ✅ Fix supplier mapping
    store: item.store ?? null, // ✅ Ensure store object is included
    storeName: item.store?.name ?? "N/A",
    storeLocation: item.store?.location ?? "N/A", // ✅ Ensure store location is mapped correctly
    price: item.price ?? 0,
    stock: item.stock_quantity ?? 0,
    low_stock_threshold: item.low_stock_threshold ?? 0,
    barcode: item.product?.barcode ?? null, // ✅ Ensure barcode is included
    qr_code: item.product?.qr_code ?? null, // ✅ Ensure QR code is included
    created_at: item.created_at ?? "N/A",
    updated_at: item.updated_at ?? "N/A",
    deleted_at: item.deleted_at ?? null, // ✅ Store-level archive
    product_deleted_at: item.product?.deleted_at ?? null, // ✅ Global product archive
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
   * ✅ Open Edit Inventory Modal
   */
  const handleEditProduct = (productId: number) => {
    const product = formattedInventory.find((p) => p.id === productId);
    if (product) {
      setEditProduct(product);
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
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : (
        <div className="w-full max-w-none px-0">
          <DataTable
            columns={getInventoryColumns(role, handleEditProduct, handleViewDetails, openConfirmDialog)}
            data={formattedInventory} // ✅ Use the fixed inventory data
            searchKeys={["productName", "productSKU", "storeName", "categoryName", "supplierName"]} // ✅ Search across multiple columns
            defaultPageSize={5} // ✅ Default pagination size
            pagination // ✅ Enable pagination
            sorting // ✅ Enable sorting
          />
        </div>
      )}

      {/* ✅ Product Details Modal */}
      {selectedProduct && (
        <ProductDetailsModal
          open={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          product={selectedProduct}
        />
      )}

      {/* ✅ Inventory Edit/Add Modal */}
      {isInventoryModalOpen && (
        <InventoryModal
          isOpen={isInventoryModalOpen}
          onClose={() => {
            setInventoryModalOpen(false);
            setEditProduct(null); // ✅ Reset edit state
          }}
          onSubmit={async (data) => {
            console.log("Saving Inventory:", data);
            return true; // ✅ Replace with actual API call
          }}
          inventoryData={editProduct}
          categories={[]} // ✅ Replace with fetched categories
          suppliers={[]} // ✅ Replace with fetched suppliers
          stores={[]} // ✅ Replace with fetched stores
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
