import { axiosInstance, handleApiError } from "@/lib/apiService";

export interface Product {
  id: number;
  name: string;
  sku: string;
  barcode: string;
  price: number;
  stock_quantity: number;
  low_stock_threshold: number;
  category_id?: number;
  supplier_id?: number;
  deleted_at?: string | null; // ✅ To check if product is archived
}

/**
 * ✅ Fetch Product by Barcode or SKU (Store-Specific)
 */
export const fetchProduct = async (storeId: number, identifier: string): Promise<Product> => {
  try {
    const response = await axiosInstance.get(`/products/${storeId}/lookup`, {
      params: { query: identifier },
    });
    return response.data.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * ✅ Add a New Product
 */
export const addProduct = async (productData: Omit<Product, "id">): Promise<Product> => {
  try {
    const response = await axiosInstance.post("/products/add", productData);
    return response.data.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * ✅ Update Product Details
 */
export const updateProduct = async (productId: number, productData: Partial<Product>): Promise<Product> => {
  try {
    const response = await axiosInstance.put(`/products/update/${productId}`, productData);
    return response.data.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * ✅ Archive a Product (Soft Delete)
 */
export const archiveProduct = async (productId: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/products/archive/${productId}`);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * ✅ Restore a Product (Undo Soft Delete)
 */
export const restoreProduct = async (productId: number): Promise<void> => {
  try {
    await axiosInstance.put(`/products/restore/${productId}`);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * ✅ Permanently Delete a Product
 */
export const deleteProduct = async (productId: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/products/delete/${productId}`);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * ✅ Get Low-Stock Products (Per Store)
 */
export const getLowStockProducts = async (storeId: number): Promise<Product[]> => {
  try {
    const response = await axiosInstance.get(`/products/low-stock`, { params: { store_id: storeId } });
    return response.data.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};
