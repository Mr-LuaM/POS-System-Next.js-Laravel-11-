"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  getInventory, 
  archiveProduct, 
  restoreProduct, 
  deleteProduct, 
  InventoryProduct 
} from "@/services/inventory";
import { toast } from "sonner";

/**
 * ✅ Custom Hook for Managing Inventory (Supports Active & Archived Products)
 */
export const useInventory = () => {
  const [inventory, setInventory] = useState<InventoryProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [archivedFilter, setArchivedFilter] = useState<boolean | null>(null); // ✅ NULL = fetch all products

  // ✅ Ensure values are retrieved safely
  const storeId = sessionStorage.getItem("storeId") || null;
  const role = sessionStorage.getItem("role") || "";

  /**
   * ✅ Fetch Inventory (Admins See All, Managers & Cashiers See Their Store)
   */
  const fetchInventory = useCallback(async () => {
    setLoading(true);
    setIsError(false);
    try {
      const data = await getInventory(archivedFilter ?? false);

      // 🔹 Restrict inventory visibility for Managers & Cashiers
      const filteredData = role === "admin" ? data : data.filter((item) => item.store_id === Number(storeId));

      setInventory(filteredData);
    } catch (error: any) {
      toast.error(`❌ Error: ${error.message || "Failed to fetch inventory."}`);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  }, [archivedFilter, role, storeId]);

  // ✅ Fetch inventory on mount & filter change
  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  /**
   * ✅ Archive Product (Admins Only)
   */
  const handleArchiveProduct = async (id: number) => {
    if (role !== "admin") return toast.error("❌ Unauthorized: Only admins can archive products.");
    try {
      await archiveProduct(id);
      toast.success("✅ Product archived successfully.");
      fetchInventory();
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
      fetchInventory();
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
      fetchInventory();
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
    refreshInventory: fetchInventory,
    archivedFilter,
    setArchivedFilter,
  };
};
