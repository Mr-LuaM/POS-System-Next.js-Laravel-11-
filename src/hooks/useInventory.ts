"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  getInventory, 
  addProduct, 
  updateProduct, 
  manageStock, 
  archiveProduct, 
  restoreProduct, 
  deleteProduct, 
  getLowStockProducts, 
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

  /**
   * ✅ Fetch Inventory from API (Supports Active, Archived & All Products)
   */
  const fetchInventory = useCallback(async () => {
    setLoading(true);
    setIsError(false);
    try {
      const data = await getInventory(archivedFilter ?? false); // ✅ Pass filter dynamically
      setInventory(data);
    } catch (error: any) {
      toast.error(`Error: ${error.message || "Failed to fetch inventory."}`);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  }, [archivedFilter]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  /**
   * ✅ Add or Update Product (With Validation & Auto-Refresh)
   */
  const saveProduct = async (productData: Partial<InventoryProduct>, id?: number): Promise<boolean> => {
    try {
      if (id) {
        await updateProduct(id, productData);
        toast.success("Success: Product updated successfully.");
      } else {
        await addProduct(productData as InventoryProduct);
        toast.success("Success: Product added successfully.");
      }
      fetchInventory();
      return true;
    } catch (error: any) {
      toast.error(`Error: ${error.message || "Failed to save product."}`);
      return false;
    }
  };

  /**
   * ✅ Manage Stock for a Product (Restock, Sale, Damage, Return, Adjustment)
   */
  const updateStock = async (storeProductId: number, stockData: { type: string; quantity: number; reason?: string }): Promise<boolean> => {
    try {
      await manageStock(storeProductId, stockData);
      toast.success(`Success: Stock ${stockData.type} successfully.`);
      fetchInventory();
      return true;
    } catch (error: any) {
      toast.error(`Error: ${error.message || "Failed to update stock."}`);
      return false;
    }
  };

  /**
   * ✅ Archive (Soft Delete) Product
   */
  const handleArchiveProduct = async (id: number) => {
    try {
      await archiveProduct(id);
      toast.success("Success: Product archived successfully.");
      fetchInventory();
    } catch (error: any) {
      toast.error(`Error: ${error.message || "Failed to archive product."}`);
    }
  };

  /**
   * ✅ Restore Product
   */
  const handleRestoreProduct = async (id: number) => {
    try {
      await restoreProduct(id);
      toast.success("Success: Product restored successfully.");
      fetchInventory();
    } catch (error: any) {
      toast.error(`Error: ${error.message || "Failed to restore product."}`);
    }
  };

  /**
   * ✅ Permanently Delete Product (Only if Archived)
   */
  const handleDeleteProduct = async (id: number) => {
    try {
      await deleteProduct(id);
      toast.success("Success: Product permanently deleted.");
      fetchInventory();
    } catch (error: any) {
      toast.error(`Error: ${error.message || "Failed to delete product."}`);
    }
  };

  /**
   * ✅ Fetch Low-Stock Products
   */
  const fetchLowStockProducts = async (storeId?: number) => {
    setLoading(true);
    setIsError(false);
    try {
      const data = await getLowStockProducts(storeId);
      return data; // ✅ Returns low-stock products
    } catch (error: any) {
      toast.error(`Error: ${error.message || "Failed to fetch low-stock products."}`);
      setIsError(true);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    inventory,
    loading,
    isError,
    saveProduct,
    updateStock,
    handleArchiveProduct,
    handleRestoreProduct,
    handleDeleteProduct,
    fetchLowStockProducts,
    refreshInventory: fetchInventory,
    archivedFilter, // ✅ Expose archived filter
    setArchivedFilter, // ✅ Expose filter setter
  };
};
