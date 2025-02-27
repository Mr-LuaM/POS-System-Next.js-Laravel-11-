import { axiosInstance, handleApiError } from "@/lib/apiService";
import { InventoryProduct } from "./inventory";

/**
 * ✅ Define Stock Movement Type
 */
export type StockMovement = {
  id: number;
  product_id: number;
  type: "restock" | "sale" | "adjustment";
  quantity: number;
  reason: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
};

/**
 * ✅ Fetch Stock Movements (NEW FUNCTION)
 */
export const getStockMovements = async (): Promise<StockMovement[]> => {
  try {
    const response = await axiosInstance.get("/inventory/stock-movements");
    return response.data.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * ✅ Manage Stock (Restock, Adjustment)
 */
export const manageStock = async (
  storeProductId: number,
  stockData: { type: string; quantity: number; reason?: string }
): Promise<InventoryProduct> => {
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
    return response.data.low_stock_products;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * ✅ Update Product Price (Admin Only)
 */
export const updateProductPrice = async (storeProductId: number, newPrice: number): Promise<boolean> => {
  try {
    const role = sessionStorage.getItem("role");
    if (role !== "admin") throw new Error("❌ Unauthorized: Only admins can update prices.");

    await axiosInstance.put(`/inventory/update-price/${storeProductId}`, { price: newPrice });
    return true;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * ✅ Update Low Stock Threshold (Managers & Admins Only)
 */
export const updateLowStockThreshold = async (storeProductId: number, threshold: number): Promise<boolean> => {
  try {
    const role = sessionStorage.getItem("role");
    if (role !== "admin" && role !== "manager") throw new Error("❌ Unauthorized: Only managers and admins can update stock thresholds.");

    await axiosInstance.put(`/inventory/update-threshold/${storeProductId}`, { low_stock_threshold: threshold });
    return true;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};
