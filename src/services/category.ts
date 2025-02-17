import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

/**
 * Fetch all categories.
 */
export const getCategories = async () => {
  return axios.get(`${API_URL}/api/categories`);
};

/**
 * Add a new category.
 * @param categoryData Category details to be added.
 */
export const addCategory = async (categoryData: { name: string }) => {
  return axios.post(`${API_URL}/api/categories/add`, categoryData);
};

/**
 * Update a category.
 * @param categoryId ID of the category to be updated.
 * @param categoryData Updated category details.
 */
export const updateCategory = async (categoryId: number, categoryData: { name: string }) => {
  return axios.put(`${API_URL}/api/categories/update/${categoryId}`, categoryData);
};

/**
 * Delete a category.
 * @param categoryId ID of the category to be deleted.
 */
export const deleteCategory = async (categoryId: number) => {
  return axios.delete(`${API_URL}/api/categories/delete/${categoryId}`);
};
