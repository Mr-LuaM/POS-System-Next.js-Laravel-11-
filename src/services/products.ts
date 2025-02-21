import { axiosInstance, handleApiError } from "@/lib/apiService";

export interface Product {
  id: number;
  name: string;
  price: number;
  barcode: string;
  stock: number;
  store_id: number; // ✅ Ensuring products belong to a specific store
}

/**
 * ✅ Fetch All Products (Filtered by Store)
 */
export const getProducts = async (searchQuery = "", storeId: number | null): Promise<Product[]> => {
  if (!storeId) return []; // ✅ Prevent API call if no store ID
  try {
    const response = await axiosInstance.get(`/products?store_id=${storeId}&search=${searchQuery}`);
    return response.data.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};
