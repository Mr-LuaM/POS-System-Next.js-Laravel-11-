"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { manageStock, getLowStockProducts, updateProductPrice, updateLowStockThreshold } from "@/services/stock";

/**
 * ✅ Custom Hook for Managing Stock & Store-Level Details
 */
export const useStockManagement = () => {
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const storeId = sessionStorage.getItem("storeId");
  const role = sessionStorage.getItem("role");

  /**
   * ✅ Validate Role Before Performing Actions
   */
  const isAuthorized = () => {
    if (role !== "admin" && role !== "manager") {
      toast.error("❌ Unauthorized action!");
      return false;
    }
    return true;
  };

  /**
   * ✅ Fetch Low-Stock Products (For Notifications)
   */
  const fetchLowStockProducts = useCallback(async () => {
    setLoading(true);
    try {
      const products = await getLowStockProducts();
      setLowStockProducts(products);
    } catch (error: any) {
      toast.error(`❌ Failed to fetch low-stock alerts: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLowStockProducts();
  }, [fetchLowStockProducts]);

  /**
   * ✅ Update Stock (Managers & Admins Only)
   */
  const updateStock = async (
    storeProductId: number,
    stockData: { type: string; quantity: number; reason?: string }
  ): Promise<boolean> => {
    if (!isAuthorized()) return false;
    if (!storeProductId || !stockData.quantity) {
      toast.error("❌ Invalid stock update request.");
      return false;
    }

    try {
      await manageStock(storeProductId, stockData);
      toast.success(`✅ Stock ${stockData.type} successfully updated.`);
      fetchLowStockProducts(); // ✅ Auto-refresh stock levels
      return true;
    } catch (error: any) {
      toast.error(`❌ Failed to update stock: ${error.message}`);
      return false;
    }
  };

  /**
   * ✅ Update Product Price (Admin Only)
   */
  const updatePrice = async (storeProductId: number, newPrice: number): Promise<boolean> => {
    if (role !== "admin") {
      toast.error("❌ Unauthorized: Only admins can update price.");
      return false;
    }

    try {
      await updateProductPrice(storeProductId, newPrice);
      toast.success(`✅ Price updated successfully.`);
      return true;
    } catch (error: any) {
      toast.error(`❌ Failed to update price: ${error.message}`);
      return false;
    }
  };

  /**
   * ✅ Update Low Stock Threshold (Managers & Admins Only)
   */
  const updateThreshold = async (storeProductId: number, threshold: number): Promise<boolean> => {
    if (!isAuthorized()) return false;

    try {
      await updateLowStockThreshold(storeProductId, threshold);
      toast.success(`✅ Low stock threshold updated.`);
      return true;
    } catch (error: any) {
      toast.error(`❌ Failed to update threshold: ${error.message}`);
      return false;
    }
  };

  return {
    updateStock,
    updatePrice, // ✅ Now included
    updateThreshold, // ✅ Now included
    lowStockProducts,
    refreshLowStockProducts: fetchLowStockProducts, // ✅ Exposed for manual refresh
    loading,
  };
};
