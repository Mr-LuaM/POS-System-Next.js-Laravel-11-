"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  getProducts, 
  addProduct, 
  updateProduct, 
  archiveProduct, 
  restoreProduct, 
  deleteProduct, 
  manageStock, 
  getLowStockAlerts, 
  StoreProduct 
} from "@/services/inventory";
import { toast } from "sonner";

/**
 * ✅ Custom Hook for Managing Store-Specific Inventory
 */
export const useInventory = (storeId?: number) => {
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [archivedFilter, setArchivedFilter] = useState<"true" | "false" | "all">("all");

  /**
   * ✅ Fetch Store-Specific Products (Active, Archived, or All)
   */
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setIsError(false);
    try {
      const data = await getProducts(archivedFilter, storeId);
      setProducts(data);
    } catch (error: any) {
      toast.error(`❌ ${error.message || "Failed to fetch products."}`);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  }, [archivedFilter, storeId]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  /**
   * ✅ Add or Update Product (Handles Multiple Store Pricing & Stock)
   */
  const saveProduct = async (
    productData: Partial<StoreProduct>,
    stores: Array<{ store_id: number; price: number; stock_quantity: number; low_stock_threshold?: number }>,
    id?: number
  ): Promise<boolean> => {
    try {
      if (id) {
        await updateProduct(id, productData, stores);
        toast.success("✅ Product updated successfully.");
      } else {
        await addProduct(productData as StoreProduct, stores);
        toast.success("✅ Product added successfully.");
      }
      await fetchProducts();
      return true;
    } catch (error: any) {
      toast.error(`❌ ${error.message || "Failed to save product."}`);
      return false;
    }
  };

  /**
   * ✅ Archive (Soft Delete) Product for a Specific Store
   */
  const handleArchiveProduct = async (storeProductId: number): Promise<void> => {
    try {
      await archiveProduct(storeProductId);
      toast.success("✅ Product archived successfully.");
      await fetchProducts();
    } catch (error: any) {
      toast.error(`❌ ${error.message || "Failed to archive product."}`);
    }
  };

  /**
   * ✅ Restore Product for a Specific Store
   */
  const handleRestoreProduct = async (storeProductId: number): Promise<void> => {
    try {
      await restoreProduct(storeProductId);
      toast.success("✅ Product restored successfully.");
      await fetchProducts();
    } catch (error: any) {
      toast.error(`❌ ${error.message || "Failed to restore product."}`);
    }
  };

  /**
   * ✅ Permanently Delete Product (Only if Archived in All Stores)
   */
  const handleDeleteProduct = async (storeProductId: number): Promise<void> => {
    try {
      await deleteProduct(storeProductId);
      toast.success("✅ Product permanently deleted.");
      await fetchProducts();
    } catch (error: any) {
      toast.error(`❌ ${error.message || "Failed to delete product."}`);
    }
  };

  /**
   * ✅ Manage Stock for a Store-Specific Product
   */
  const handleManageStock = async (
    storeProductId: number,
    type: "restock" | "sale" | "adjustment" | "damage" | "return",
    quantity: number,
    reason?: string
  ) => {
    try {
      await manageStock(storeProductId, type, quantity, reason);
      toast.success(`✅ Stock ${type} recorded.`);
      await fetchProducts();
    } catch (error: any) {
      toast.error(`❌ ${error.message || "Failed to update stock."}`);
    }
  };

  /**
   * ✅ Fetch Low Stock Alerts for a Specific Store
   */
  const fetchLowStockAlerts = async (): Promise<StoreProduct[]> => {
    try {
      const lowStockProducts = await getLowStockAlerts(storeId);
      return lowStockProducts;
    } catch (error: any) {
      toast.error(`❌ ${error.message || "Failed to fetch low stock alerts."}`);
      return [];
    }
  };

  return {
    products,
    loading,
    isError,
    saveProduct,
    handleArchiveProduct,
    handleRestoreProduct,
    handleDeleteProduct,
    handleManageStock,
    fetchLowStockAlerts,
    refreshProducts: fetchProducts,
    archivedFilter,
    setArchivedFilter,
  };
};
