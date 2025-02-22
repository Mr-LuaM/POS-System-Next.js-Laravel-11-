"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  getInventory, 
  archiveProduct, 
  restoreProduct, 
  deleteProduct, 
  archiveStoreProduct,  // ✅ Store-level Archive
  restoreStoreProduct,  // ✅ Store-level Restore
  addInventoryItem, 
  updateInventoryItem, 
  InventoryProduct ,searchProductBySkuOrBarcode 
} from "@/services/inventory";
import { toast } from "sonner";

/**
 * ✅ Helper Function: Retrieve Session Storage Value
 */
const getSessionValue = (key: string): string | null => {
  if (typeof window !== "undefined") {
    return sessionStorage.getItem(key);
  }
  return null;
};

/**
 * ✅ Custom Hook for Managing Inventory (CRUD, Active & Archived Products)
 */
export const useInventory = () => {
  const [inventory, setInventory] = useState<InventoryProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [archivedFilter, setArchivedFilter] = useState<boolean | null>(null); // ✅ NULL = fetch all products
  const [searchResult, setSearchResult] = useState<any | null>(null); // ✅ Store searched product

  const storeId = getSessionValue("storeId");
  const role = getSessionValue("role");

  /**
   * ✅ Fetch Inventory (Admins See All, Managers See Their Store Only)
   */
  const fetchInventory = useCallback(async () => {
    setLoading(true);
    setIsError(false);
    try {
      const filter = archivedFilter === null ? "null" : archivedFilter.toString();
      const data = await getInventory(filter);

      // ✅ Format data before setting state
      const processedInventory = data.map((item: InventoryProduct) => ({
        ...item,
        category_id: item.product?.category?.id ? item.product.category.id.toString() : "other",
        supplier_id: item.product?.supplier?.id ? item.product.supplier.id.toString() : "other",
        new_category: item.product?.category?.id ? "" : item.product?.category?.name || "",
        new_supplier: item.product?.supplier?.id ? "" : item.product?.supplier?.name || "",
      }));

      // ✅ Store Managers see only their store's inventory
      const filteredInventory =
        role === "admin" ? processedInventory : processedInventory.filter((item) => item.store_id === Number(storeId));

      setInventory(filteredInventory);
    } catch (error: any) {
      toast.error(`❌ Error: ${error.message || "Failed to fetch inventory."}`);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  }, [archivedFilter, role, storeId]);

  // ✅ Fetch inventory on mount & when filter changes
  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  /**
   * ✅ Add New Inventory Item
   */
  const addInventory = async (data: any) => {
    try {
      const newProduct = await addInventoryItem(data);
      toast.success("✅ Product added successfully.");
      
      // ✅ Update state instantly instead of waiting for a full refetch
      setInventory((prevInventory) => [newProduct, ...prevInventory]);

      return true;
    } catch (error: any) {
      toast.error(`❌ Failed to add product: ${error.message}`);
      return false;
    }
  };

  /**
   * ✅ Update Existing Inventory Item
   */
  const updateInventory = async (id: number, data: any) => {
    try {
      const updatedProduct = await updateInventoryItem(id, data);
      toast.success("✅ Product updated successfully.");

      // ✅ Update state instantly instead of waiting for a full refetch
      setInventory((prevInventory) =>
        prevInventory.map((item) => (item.id === id ? updatedProduct : item))
      );

      return true;
    } catch (error: any) {
      toast.error(`❌ Failed to update product: ${error.message}`);
      return false;
    }
  };

  /**
   * ✅ Archive Product (Admins Only)
   */
  const handleArchiveProduct = async (id: number) => {
    if (role !== "admin") {
      return toast.error("❌ Unauthorized: Only admins can globally archive products.");
    }

    try {
      await archiveProduct(id);
      toast.success("✅ Product archived globally.");

      // ✅ Remove from list instead of waiting for a full refetch
      setInventory((prevInventory) => prevInventory.filter((item) => item.id !== id));
    } catch (error: any) {
      toast.error(`❌ Failed to archive product: ${error.message}`);
    }
  };

  /**
   * ✅ Restore Product (Admins Only)
   */
  const handleRestoreProduct = async (id: number) => {
    if (role !== "admin") {
      return toast.error("❌ Unauthorized: Only admins can restore globally archived products.");
    }

    try {
      await restoreProduct(id);
      toast.success("✅ Product restored globally.");
      fetchInventory(); // ✅ Refresh inventory after restore
    } catch (error: any) {
      toast.error(`❌ Failed to restore product: ${error.message}`);
    }
  };

  /**
   * ✅ Store-Level Archive (Admins & Managers)
   */
  const handleStoreArchive = async (id: number) => {
    if (!["admin", "manager"].includes(role || "")) {
      return toast.error("❌ Unauthorized: Only admins & managers can archive products at the store level.");
    }

    try {
      await archiveStoreProduct(id);
      toast.success("✅ Product archived in this store.");

      // ✅ Update state instead of full refresh
      setInventory((prevInventory) =>
        prevInventory.map((item) => (item.id === id ? { ...item, deleted_at: new Date().toISOString() } : item))
      );
    } catch (error: any) {
      toast.error(`❌ Failed to archive product in store: ${error.message}`);
    }
  };

  /**
   * ✅ Store-Level Restore (Admins & Managers)
   */
  const handleStoreRestore = async (id: number) => {
    if (!["admin", "manager"].includes(role || "")) {
      return toast.error("❌ Unauthorized: Only admins & managers can restore products at the store level.");
    }

    try {
      await restoreStoreProduct(id);
      toast.success("✅ Product restored in this store.");

      // ✅ Update state instead of full refresh
      setInventory((prevInventory) =>
        prevInventory.map((item) => (item.id === id ? { ...item, deleted_at: null } : item))
      );
    } catch (error: any) {
      toast.error(`❌ Failed to restore product in store: ${error.message}`);
    }
  };

  /**
   * ✅ Permanently Delete Product (Admins Only)
   */
  const handleDeleteProduct = async (id: number) => {
    if (role !== "admin") {
      return toast.error("❌ Unauthorized: Only admins can permanently delete products.");
    }

    try {
      await deleteProduct(id);
      toast.success("✅ Product permanently deleted.");

      // ✅ Remove from list instead of waiting for a full refetch
      setInventory((prevInventory) => prevInventory.filter((item) => item.id !== id));
    } catch (error: any) {
      toast.error(`❌ Failed to delete product: ${error.message}`);
    }
  };
/**
   * ✅ Search Product by SKU or Barcode
   */
const searchProduct = async (query: string) => {
  if (!query.trim()) {
    toast.error("Enter a SKU or Barcode.");
    return null;
  }

  setLoading(true);
  try {
    const result = await searchProductBySkuOrBarcode(query);
    console.log(result)
    if (result) {
      setSearchResult(result);
    } else {
      toast.error("Product not found.");
      setSearchResult(null);
    }
    return result;
  } catch (error) {
    toast.error(error.message || "Error searching product.");
    return null;
  } finally {
    setLoading(false);
  }
};
  
  return {
    inventory,
    loading,
    isError,fetchInventory,
    handleArchiveProduct,   // ✅ Global Archive (Admin)
    handleRestoreProduct,   // ✅ Global Restore (Admin)
    handleStoreArchive,     // ✅ Store-Level Archive (Admin & Manager)
    handleStoreRestore,     // ✅ Store-Level Restore (Admin & Manager)
    handleDeleteProduct,    // ✅ Permanent Delete (Admin)
    addInventory,
    updateInventory,
    refreshInventory: fetchInventory,
    archivedFilter,
    setArchivedFilter,
    searchProduct,       // ✅ Search function (SKU / Barcode)
    searchResult,  
  };
};
