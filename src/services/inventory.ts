import { axiosInstance, handleApiError } from "@/lib/apiService";

export interface Category {
  id: number;
  name: string;
  deleted_at?: string | null;
}

export interface Supplier {
  id: number;
  name: string;
  contact: string;
  email?: string;
  address?: string;
  deleted_at?: string | null;
}

export interface Store {
  id: number;
  name: string;
  location?: string;
}

export interface Product {
  id: number;
  name: string;
  sku: string;
  barcode?: string;
  qr_code?: string;
  category_id?: number;
  supplier_id?: number;
  category?: Category;
  supplier?: Supplier;
  deleted_at?: string | null;
}

export interface StoreProduct {
  id: number;
  store_id: number;
  product_id: number;
  price: number;
  stock_quantity: number;
  low_stock_threshold?: number;
  deleted_at?: string | null;
  product?: Product;
  store?: Store;
}

/**
 * ✅ Fetch All Store-Specific Products (Active & Archived)
 */
export const getProducts = async (
  includeArchived: "true" | "false" | "all" = "all",
  storeId?: number
): Promise<StoreProduct[]> => {
  try {
    const response = await axiosInstance.get(`/inventory`, {
      params: { archived: includeArchived, store_id: storeId },
    });

    return response.data.data.map((storeProduct: any) => ({
      ...storeProduct,
      price: parseFloat(storeProduct.price), // ✅ Ensure price is a number
      product: storeProduct.product ? { ...storeProduct.product } : null,
      store: storeProduct.store ? { ...storeProduct.store } : null,
    }));
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * ✅ Add a New Product Across Stores
 */
export const addProduct = async (productData: Omit<Product, "id">, stores: Array<{ store_id: number; price: number; stock_quantity: number; low_stock_threshold?: number }>): Promise<Product> => {
  try {
    const response = await axiosInstance.post("/inventory/add", {
      ...productData,
      stores, // ✅ Pass multiple store-specific details
    });

    return response.data.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * ✅ Update an Existing Product (Excludes Stock Quantity)
 */
export const updateProduct = async (
  productId: number,
  productData: Partial<Product>,
  stores?: Array<{ store_id: number; price: number; stock_quantity: number; low_stock_threshold?: number }>
): Promise<Product> => {
  try {
    const response = await axiosInstance.put(`/inventory/update/${productId}`, {
      ...productData,
      stores, // ✅ Update store-specific details if provided
    });

    return response.data.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * ✅ Archive a Product for a Specific Store (Soft Delete)
 */
export const archiveProduct = async (storeProductId: number): Promise<boolean> => {
  try {
    await axiosInstance.delete(`/inventory/archive/${storeProductId}`);
    return true;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * ✅ Restore a Product for a Specific Store
 */
export const restoreProduct = async (storeProductId: number): Promise<boolean> => {
  try {
    await axiosInstance.put(`/inventory/restore/${storeProductId}`);
    return true;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * ✅ Permanently Delete a Product (Only if Archived in All Stores)
 */
export const deleteProduct = async (storeProductId: number): Promise<boolean> => {
  try {
    await axiosInstance.delete(`/inventory/delete/${storeProductId}`);
    return true;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * ✅ Manage Stock for a Specific Store's Product
 */
export const manageStock = async (
  storeProductId: number,
  type: "restock" | "sale" | "adjustment" | "damage" | "return",
  quantity: number,
  reason?: string
): Promise<boolean> => {
  try {
    await axiosInstance.put(`/inventory/manage-stock/${storeProductId}`, { type, quantity, reason });
    return true;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * ✅ Get Low Stock Alerts for a Specific Store
 */
export const getLowStockAlerts = async (storeId?: number): Promise<StoreProduct[]> => {
  try {
    const response = await axiosInstance.get(`/inventory/low-stock-alerts`, {
      params: { store_id: storeId },
    });

    return response.data.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};
