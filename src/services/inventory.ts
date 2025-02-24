import { axiosInstance, handleApiError } from "@/lib/apiService";

/**
 * ✅ Inventory Product Interface (Ensures All Data is Included)
 */
export interface InventoryProduct {
  id: number;
  store_id: number;
  product_id: number;
  price: number;
  stock_quantity: number;
  low_stock_threshold?: number;
  deleted_at?: string | null; // ✅ Store-level archive status
  product_deleted_at?: string | null; // ✅ Global archive status
  product?: {
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
 * ✅ Fetch Inventory (Admins See All, Others See Only Their Store)
 */
export const getInventory = async (includeArchived = false): Promise<InventoryProduct[]> => {
  try {
    const role = typeof window !== "undefined" ? sessionStorage.getItem("role") : "";
    const storeId = typeof window !== "undefined" ? sessionStorage.getItem("storeId") : null;

    const params: Record<string, any> = { archived: includeArchived };

    // 🔹 Restrict Managers & Cashiers to their store's inventory
    if (role !== "admin" && storeId) {
      params.store_id = storeId;
    }

    const response = await axiosInstance.get(`/inventory`, { params });

    return response.data.data || []; // ✅ Always return an array
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * ✅ Add a New Inventory Item (Admins Only)
 */
export const addInventoryItem = async (productData: any): Promise<InventoryProduct> => {
  try {
    const response = await axiosInstance.post("/inventory/add", productData);
    return response.data.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * ✅ Update an Inventory Item (Admins Only)
 */
export const updateInventoryItem = async (productId: number, productData: any): Promise<InventoryProduct> => {
  try {
    const response = await axiosInstance.put(`/inventory/update/${productId}`, productData);
    return response.data.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * ✅ Manage Stock (Managers & Admins Can Adjust Stock)
 */
export const manageStock = async (
  storeProductId: number,
  stockData: { type: string; quantity: number; reason?: string }
): Promise<InventoryProduct> => {
  try {
    const response = await axiosInstance.put(`/inventory/manage-stock/${storeProductId}`, stockData);
    return response.data.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * ✅ Archive a Product (GLOBAL - Admins Only)
 */
export const archiveProduct = async (productId: number): Promise<void> => {
  try {
    await axiosInstance.put(`/inventory/global-archive/${productId}`);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * ✅ Restore a Globally Archived Product (Admins Only)
 */
export const restoreProduct = async (productId: number): Promise<void> => {
  try {
    await axiosInstance.put(`/inventory/global-restore/${productId}`);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * ✅ Store-Level Archive (Admins & Managers)
 */
export const archiveStoreProduct = async (storeProductId: number): Promise<void> => {
  try {
    await axiosInstance.put(`/inventory/store-archive/${storeProductId}`);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * ✅ Store-Level Restore (Admins & Managers)
 */
export const restoreStoreProduct = async (storeProductId: number): Promise<void> => {
  try {
    await axiosInstance.put(`/inventory/store-restore/${storeProductId}`);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * ✅ Permanently Delete a Product (Admins Only)
 */
export const deleteProduct = async (productId: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/inventory/delete/${productId}`);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * ✅ Fetch Low-Stock Products (Per Store)
 */
export const getLowStockProducts = async (storeId?: number): Promise<InventoryProduct[]> => {
  try {
    const response = await axiosInstance.get(`/inventory/low-stock`, { params: { store_id: storeId } });
    return response.data.data || [];
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/** ✅ Fetch product by SKU or barcode */
export async function searchProductBySkuOrBarcode(query: string, storeId?: number) {
  if (!query.trim()) throw new Error("Query is required");

  try {
    const response = await axiosInstance.get(`/inventory/search`, { 
      params: { query, store_id: storeId } // ✅ Pass storeId as optional parameter
    });

    return response.data.success ? response.data.data : null;
  } catch (error: any) {
    console.error("Error fetching product:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch product details");
  }
}

export const addProductByBarcode = async (barcode: string, storeId: string) => {
  try {
    
    const response = await axiosInstance.post("/inventory/quick-add", {
      barcode,
      store_id: storeId,
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};
