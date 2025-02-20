"use client";

import { axiosInstance, handleApiError } from "@/lib/apiService";
import { toast } from "sonner";

/**
 * ✅ Custom Hook for Managing Stock Adjustments
 */
export const useStockManagement = () => {
  const storeId = sessionStorage.getItem("storeId");
  const role = sessionStorage.getItem("role");

  /**
   * ✅ Update Stock (Managers & Admins Only)
   */
  const updateStock = async (storeProductId: number, stockData: { type: string; quantity: number; reason?: string }): Promise<boolean> => {
    if (role !== "admin" && role !== "manager") {
      toast.error("❌ Unauthorized action!");
      return false;
    }

    try {
      const response = await axiosInstance.post(`/inventory/manage-stock/${storeProductId}`, stockData);
      toast.success(`✅ Stock ${stockData.type} successfully.`);
      return true;
    } catch (error: any) {
      toast.error(`❌ Failed to update stock: ${handleApiError(error)}`);
      return false;
    }
  };

  /**
   * ✅ Fetch Low-Stock Products (For Notifications)
   */
  const fetchLowStockProducts = async () => {
    if (!storeId) return [];
    try {
      const response = await axiosInstance.get(`/inventory/low-stock-alerts?store_id=${storeId}`);
      return response.data.data || [];
    } catch (error: any) {
      toast.error(`❌ Failed to fetch low-stock alerts: ${handleApiError(error)}`);
      return [];
    }
  };

  return { updateStock, fetchLowStockProducts };
};
