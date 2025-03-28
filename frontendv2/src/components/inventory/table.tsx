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
import ManageStockModal from "./stock-modal"; // ✅ Import Manage Stock Modal
import ManageStoreDetailsModal from "./store-details-modal";
/**
 * ✅ Inventory Table (Handles Full CRUD & Archive)
 */
export default function InventoryTable({ role }: { role: "admin" | "manager" }) {
  const {
    inventory,
    loading,
    handleArchiveProduct,
    handleRestoreProduct,
    handleDeleteProduct, // ✅ Ensure delete function is included
    handleStoreArchive, // ✅ Fix Store-Level Archive
    handleStoreRestore, // ✅ Fix Store-Level Restore
     
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
  const [globalConfirmDialog, setGlobalConfirmDialog] = useState<{ id: number; type: "archive" | "restore" } | null>(null);
  const [deleteProductId, setDeleteProductId] = useState<number | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [globalConfirmLoading, setGlobalConfirmLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isInventoryModalOpen, setInventoryModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<any | null>(null);
  const [selectedStockProduct, setSelectedStockProduct] = useState<any | null>(null);
  const [isManageStockOpen, setManageStockOpen] = useState(false);
  const [selectedStoreProduct, setSelectedStoreProduct] = useState<any | null>(null);
  const [isManageStoreDetailsOpen, setManageStoreDetailsOpen] = useState(false);

/*  * ✅ Format Inventory Data (Flatten Nested Properties)
   */
  const formattedInventory = inventory.map((item) => ({
    id: item.id,
    productName: item.product?.name ?? "Unnamed Product",
    productID: item.product?.id,
    productSKU: item.product?.sku ?? "N/A",
    categoryName: item.product?.category?.name ?? "N/A",
    supplier: item.product?.supplier ?? null,
    supplierName: item.product?.supplier?.name ?? "N/A",
    storeId: item.store?.id ?? null, // ✅ Store ID for filtering
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
   * ✅ Handle Store-Level Archive/Restore
   */
const handleStoreConfirmAction = async () => {
  if (!confirmDialog) return;
  setConfirmLoading(true);

  try {
    if (confirmDialog.type === "archive") {
      await handleStoreArchive(confirmDialog.id);
    } else {
      await handleStoreRestore(confirmDialog.id);
    }
    refreshInventory(); // ✅ Refresh after action
  } catch (error) {
    console.error("Error processing store archive/restore:", error);
  } finally {
    setConfirmDialog(null);
    setConfirmLoading(false);
  }
};

/**
 * ✅ Handle Global Archive/Restore
 */
const handleGlobalConfirmAction = async () => {
  if (!globalConfirmDialog) return;
  setGlobalConfirmLoading(true);

  try {
    if (globalConfirmDialog.type === "archive") {
      await handleArchiveProduct(globalConfirmDialog.id);
    } else {
      await handleRestoreProduct(globalConfirmDialog.id);
    }
    refreshInventory(); // ✅ Refresh after action
  } catch (error) {
    console.error("Error processing global archive/restore:", error);
  } finally {
    setGlobalConfirmDialog(null);
    setGlobalConfirmLoading(false);
  }
};

/**
 * ✅ Handle Permanent Deletion
 */
const handleHardDelete = async (id: number) => {
  setDeleteLoading(true);

  try {
    await handleDeleteProduct(id); // ✅ Pass ID correctly
    refreshInventory(); // ✅ Refresh after deletion
  } catch (error) {
    console.error("Error deleting product:", error);
  } finally {
    setDeleteProductId(null);
    setDeleteLoading(false);
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
  const handleManageStock = (productId: number, storeId: number) => {
    const product = formattedInventory.find((p) => p.id === productId && p.storeId === storeId);
    
    if (!product) {
      console.error(`Product with ID ${productId} not found in store ${storeId}`);
      return;
    }
  
    setSelectedStockProduct(product);
    setManageStockOpen(true);
  };
  
  
  const handleManageStoreDetails = (productId: number, storeId: number) => {
    const product = formattedInventory.find((p) => p.id === productId && p.storeId === storeId);
    if (!product) {
      console.error(`Product with ID ${productId} not found in store ${storeId}`);
      return;
    }
    setSelectedStoreProduct(product);
    setManageStoreDetailsOpen(true);
  

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
        columns={getInventoryColumns(
          role,
          handleEditProduct,
          handleViewDetails,
          (id, type) => setGlobalConfirmDialog({ id, type }), // ✅ Fix: Global Archive/Restore
    (id, type) => setConfirmDialog({ id, type }), // ✅ Fix: Store-Level Archive/Restore
          handleManageStock,
          handleManageStoreDetails ,// ✅ Add this missing function
          handleHardDelete 
        )}
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

    {/* ✅ Store-Level Archive/Restore Confirmation */}
    {confirmDialog && (
        <ConfirmDialog
          open={true}
          onConfirm={handleStoreConfirmAction}
          onCancel={() => setConfirmDialog(null)}
          title={confirmDialog.type === "archive" ? "Archive Product in This Store?" : "Restore Product in This Store?"}
          description={
            confirmDialog.type === "archive"
              ? "This will temporarily hide the product from this store’s inventory. It will remain available in other stores unless archived globally."
              : "This will restore the product in this store, making it available for sales and stock adjustments."
          }
          confirmLabel={confirmDialog.type === "archive" ? "Archive in Store" : "Restore in Store"}
          cancelLabel="Cancel"
          confirmVariant={confirmDialog.type === "archive" ? "outline" : "primary"}
          loading={confirmLoading}
        />
      )}

      {/* ✅ Global Archive/Restore Confirmation */}
      {globalConfirmDialog && (
        <ConfirmDialog
          open={true}
          onConfirm={handleGlobalConfirmAction}
          onCancel={() => setGlobalConfirmDialog(null)}
          title={globalConfirmDialog.type === "archive" ? "Archive Product Globally?" : "Restore Product Globally?"}
          description={
            globalConfirmDialog.type === "archive"
              ? "Archiving this product globally will remove it from all stores. Only administrators will be able to restore it."
              : "Restoring this product globally will make it available again across all stores."
          }
          confirmLabel={globalConfirmDialog.type === "archive" ? "Archive Globally" : "Restore Globally"}
          cancelLabel="Cancel"
          confirmVariant={globalConfirmDialog.type === "archive" ? "outline" : "primary"}
          loading={globalConfirmLoading}
        />
      )}

      {/* ✅ Hard Delete Confirmation */}
      {deleteProductId && (
        <ConfirmDialog
          open={true}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteProductId(null)}
          title="Permanently Delete Product?"
          description="⚠️ This action is irreversible! Deleting this product will remove it from all records, including archived items. Are you sure you want to proceed?"
          confirmLabel="Yes, Delete Permanently"
          cancelLabel="Cancel"
          confirmVariant="destructive"
          loading={deleteLoading}
        />
      )}


        {/* ✅ Manage Stock Modal */}
     {/* ✅ Manage Stock Modal */}
{isManageStockOpen && selectedStockProduct && (
  <ManageStockModal
    isOpen={isManageStockOpen}
    onClose={() => {
      setManageStockOpen(false);
      refreshInventory(); // ✅ Refresh inventory when closing stock modal
    }}
    stockData={selectedStockProduct}
    refreshInventory={refreshInventory} // ✅ Pass to modal for refresh after update
  />
)}

{/* ✅ Manage Store Details Modal */}
{isManageStoreDetailsOpen && selectedStoreProduct && (
  <ManageStoreDetailsModal
    isOpen={isManageStoreDetailsOpen}
    onClose={() => {
      setManageStoreDetailsOpen(false);
      refreshInventory(); // ✅ Refresh inventory when closing store details modal
    }}
    storeData={selectedStoreProduct}
    refreshInventory={refreshInventory} // ✅ Pass to modal for refresh after update
  />
)}



    </div>
  );
}
