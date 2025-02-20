import { axiosInstance, handleApiError } from "@/lib/apiService";
import { InventoryProduct } from "./inventory";

/**
 * ✅ Manage Stock (Restock, Sale, Damage, Return, Adjustment)
 */
export const manageStock = async (storeProductId: number, stockData: { type: string; quantity: number; reason?: string }): Promise<InventoryProduct> => {
  try {
    const role = sessionStorage.getItem("role");
    if (role !== "admin" && role !== "manager") throw new Error("❌ Unauthorized: Only managers and admins can adjust stock.");

    const response = await axiosInstance.put(`/inventory/manage-stock/${storeProductId}`, stockData);
    return response.data.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * ✅ Get Low-Stock Products (Per Store)
 */
export const getLowStockProducts = async (): Promise<InventoryProduct[]> => {
  try {
    const storeId = sessionStorage.getItem("storeId");
    if (!storeId) return [];

    const response = await axiosInstance.get(`/inventory/low-stock`, { params: { store_id: storeId } });
    return response.data.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};
