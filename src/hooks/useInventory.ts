"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  getInventory, 
  archiveProduct, 
  restoreProduct, 
  deleteProduct, 
  addInventoryItem, 
  updateInventoryItem, 
  InventoryProduct 
} from "@/services/inventory";
import { toast } from "sonner";

/**
 * ✅ Custom Hook for Managing Inventory (Supports CRUD, Active & Archived Products)
 */
export const useInventory = () => {
  const [inventory, setInventory] = useState<InventoryProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [archivedFilter, setArchivedFilter] = useState<boolean | null>(null); // ✅ NULL = fetch all products

  const getSessionValue = (key: string) => (typeof window !== "undefined" ? sessionStorage.getItem(key) : null);
  const storeId = getSessionValue("storeId");
  const role = getSessionValue("role");

  /**
   * ✅ Fetch Inventory (Admins See All, Managers & Cashiers See Their Store)
   */
  const fetchInventory = useCallback(async () => {
    setLoading(true);
    setIsError(false);
    try {
      const filter = archivedFilter === null ? "null" : archivedFilter.toString();
      const data = await getInventory(filter);

      const processedInventory = data.map((item: InventoryProduct) => ({
        ...item,
        category_id: item.product?.category?.id ? item.product.category.id.toString() : "other",
        supplier_id: item.product?.supplier?.id ? item.product.supplier.id.toString() : "other",
        new_category: item.product?.category?.id ? "" : item.product?.category?.name || "",
        new_supplier: item.product?.supplier?.id ? "" : item.product?.supplier?.name || "",
      }));

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

      return true; // ✅ Return success
    } catch (error: any) {
      toast.error(`❌ Failed to add product: ${error.message}`);
      return false; // ❌ Return failure
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

      return true; // ✅ Return success
    } catch (error: any) {
      toast.error(`❌ Failed to update product: ${error.message}`);
      return false; // ❌ Return failure
    }
  };

  /**
   * ✅ Archive Product (Admins Only)
   */
  const handleArchiveProduct = async (id: number) => {
    if (role !== "admin") return toast.error("❌ Unauthorized: Only admins can archive products.");
    try {
      await archiveProduct(id);
      toast.success("✅ Product archived successfully.");

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
    if (role !== "admin") return toast.error("❌ Unauthorized: Only admins can restore products.");
    try {
      await restoreProduct(id);
      toast.success("✅ Product restored successfully.");
      fetchInventory(); // ✅ Refresh inventory after restore
    } catch (error: any) {
      toast.error(`❌ Failed to restore product: ${error.message}`);
    }
  };

  /**
   * ✅ Permanently Delete Product (Admins Only)
   */
  const handleDeleteProduct = async (id: number) => {
    if (role !== "admin") return toast.error("❌ Unauthorized: Only admins can delete products.");
    try {
      await deleteProduct(id);
      toast.success("✅ Product permanently deleted.");

      // ✅ Remove from list instead of waiting for a full refetch
      setInventory((prevInventory) => prevInventory.filter((item) => item.id !== id));
    } catch (error: any) {
      toast.error(`❌ Failed to delete product: ${error.message}`);
    }
  };

  return {
    inventory,
    loading,
    isError,
    handleArchiveProduct,
    handleRestoreProduct,
    handleDeleteProduct,
    addInventory, // ✅ Expose Add Function
    updateInventory, // ✅ Expose Update Function
    refreshInventory: fetchInventory,
    archivedFilter,
    setArchivedFilter,
  };
};
