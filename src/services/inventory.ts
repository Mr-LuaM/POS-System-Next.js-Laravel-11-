import { axiosInstance, handleApiError } from "@/lib/apiService";

/**
 * ✅ Inventory Product Interface
 */
export interface InventoryProduct {
  id: number;
  store_id: number;
  product_id: number;
  price: number;
  stock_quantity: number;
  low_stock_threshold?: number;
  deleted_at?: string | null; // ✅ To check if product is archived
  product: {
    id: number;
    name: string;
    sku: string;
    barcode?: string;
    qr_code?: string;
    category_id?: number;
    supplier_id?: number;
    category?: {
      id: number;
      name: string;
    };
    supplier?: {
      id: number;
      name: string;
    };
  };
}

/**
 * ✅ Fetch All Store Inventory (Supports Archived Products)
 */
export const getInventory = async (includeArchived = false): Promise<InventoryProduct[]> => {
  try {
    const response = await axiosInstance.get(`/inventory?archived=${includeArchived}`);
    return response.data.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * ✅ Add a New Product (Multi-Store Support)
 */
export const addProduct = async (productData: Omit<InventoryProduct, "id" | "product">): Promise<InventoryProduct> => {
  try {
    const response = await axiosInstance.post("/inventory/add", productData);
    return response.data.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * ✅ Update a Product
 */
export const updateProduct = async (productId: number, productData: Partial<Omit<InventoryProduct, "product">>): Promise<InventoryProduct> => {
  try {
    const response = await axiosInstance.put(`/inventory/update/${productId}`, productData);
    return response.data.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * ✅ Manage Stock (Restock, Sale, Damage, Return, Adjustment)
 */
export const manageStock = async (storeProductId: number, stockData: { type: string; quantity: number; reason?: string }): Promise<InventoryProduct> => {
  try {
    const response = await axiosInstance.put(`/inventory/manage-stock/${storeProductId}`, stockData);
    return response.data.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * ✅ Archive a Product (Soft Delete)
 */
export const archiveProduct = async (storeProductId: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/inventory/archive/${storeProductId}`);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * ✅ Restore an Archived Product
 */
export const restoreProduct = async (storeProductId: number): Promise<void> => {
  try {
    await axiosInstance.put(`/inventory/restore/${storeProductId}`);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * ✅ Permanently Delete a Product (Only if no sales history exists)
 */
export const deleteProduct = async (storeProductId: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/inventory/delete/${storeProductId}`);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * ✅ Get Low-Stock Products (Per Store)
 */
export const getLowStockProducts = async (storeId?: number): Promise<InventoryProduct[]> => {
  try {
    const response = await axiosInstance.get(`/inventory/low-stock`, { params: { store_id: storeId } });
    return response.data.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};
