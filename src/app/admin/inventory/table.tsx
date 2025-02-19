"use client";

import { useInventory } from "@/hooks/useInventory";
import { useState } from "react";
import { DataTable } from "@/components/common/data-table";
import { getProductColumns } from "./columns";
import InventoryModal from "./inventory-modal";
import StockManageModal from "./stock-modal"; // ✅ Stock Management Modal
import ConfirmDialog from "@/components/common/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import InventoryFilters from "./filters"; // ✅ Import Filters

/**
 * ✅ Inventory Table (Handles CRUD, Archive, Restore, Manage Stock)
 */
export default function InventoryTable() {
  const [selectedStore, setSelectedStore] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSupplier, setSelectedSupplier] = useState<string>("all");

  const { 
    products, 
    loading, 
    saveProduct, 
    handleArchiveProduct,
    handleRestoreProduct,
    handleDeleteProduct,
    handleManageStock, 
    archivedFilter, 
    setArchivedFilter 
  } = useInventory(selectedStore, selectedCategory, selectedSupplier); // ✅ Pass filters

  const [productData, setProductData] = useState<any | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isStockModalOpen, setStockModalOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{ id: number; type: "archive" | "restore" | "delete" } | null>(null);

  const openAddModal = () => {
    setProductData(null);
    setModalOpen(true);
  };

  const openEditModal = (product: any) => {
    setProductData(product);
    setModalOpen(true);
  };

  const openManageStock = (product: any) => {
    setProductData(product);
    setStockModalOpen(true);
  };

  const openConfirmDialog = (id: number, type: "archive" | "restore" | "delete") => {
    setConfirmDialog({ id, type });
  };

  return (
    <div className="w-full p-6 space-y-6">
      {/* ✅ Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">Inventory</h1>
        <Button onClick={openAddModal}>+ Add Product</Button>
      </div>

      {/* ✅ Filters */}
      <InventoryFilters
        selectedStore={selectedStore}
        setSelectedStore={setSelectedStore}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedSupplier={selectedSupplier}
        setSelectedSupplier={setSelectedSupplier}
      />

      {/* ✅ Toggle Active/Archived */}
      <div className="flex justify-end">
        <ToggleGroup value={archivedFilter} onValueChange={setArchivedFilter} type="single" className="mb-4">
          <ToggleGroupItem value="all">All</ToggleGroupItem>
          <ToggleGroupItem value="false">Active</ToggleGroupItem>
          <ToggleGroupItem value="true">Archived</ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* ✅ Table */}
      {loading ? (
        <Skeleton className="h-10 w-full" />
      ) : (
        <DataTable
          columns={getProductColumns(openEditModal, openConfirmDialog, openManageStock)}
          data={products}
          searchKey="name"
        />
      )}

      {/* ✅ Inventory Modal */}
      <InventoryModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} productData={productData} />

      {/* ✅ Stock Management Modal */}
      <StockManageModal
        isOpen={isStockModalOpen}
        onClose={() => setStockModalOpen(false)}
        productData={productData}
        onSubmit={handleManageStock}
      />

      {/* ✅ Confirm Dialog */}
      {confirmDialog && (
        <ConfirmDialog
          key={confirmDialog.id}
          open={true}
          onConfirm={() => {
            if (confirmDialog.type === "archive") handleArchiveProduct(confirmDialog.id);
            if (confirmDialog.type === "restore") handleRestoreProduct(confirmDialog.id);
            if (confirmDialog.type === "delete") handleDeleteProduct(confirmDialog.id);
            setConfirmDialog(null);
          }}
          onCancel={() => setConfirmDialog(null)}
          title={`Are you sure you want to ${confirmDialog.type} this product?`}
          confirmLabel={confirmDialog.type}
        />
      )}
    </div>
  );
}
