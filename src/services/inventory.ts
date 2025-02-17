import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

/**
 * Fetch all inventory products.
 */
export const getProducts = async () => {
  return axios.get(`${API_URL}/api/products`);
};

/**
 * Add a new product to inventory.
 * @param productData Product details to be added.
 */
export const addProduct = async (productData: any) => {
  return axios.post(`${API_URL}/api/products`, productData);
};

/**
 * Update product details in inventory.
 * @param productId ID of the product to be updated.
 * @param productData Updated product details.
 */
export const updateProduct = async (productId: number, productData: any) => {
  return axios.put(`${API_URL}/api/products/${productId}`, productData);
};

/**
 * Delete a product from inventory.
 * @param productId ID of the product to be deleted.
 */
export const deleteProduct = async (productId: number) => {
  return axios.delete(`${API_URL}/api/products/${productId}`);
};
