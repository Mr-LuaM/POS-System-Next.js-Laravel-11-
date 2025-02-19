import { axiosInstance, handleApiError } from "@/lib/apiService";

/**
 * ✅ Category Type Definition
 */
export interface Category {
  id: number;
  name: string;
}

/**
 * ✅ Fetch All Categories
 */
export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await axiosInstance.get("/categories");
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * ✅ Add a New Category
 */
export const addCategory = async (categoryName: string): Promise<Category> => {
  try {
    const response = await axiosInstance.post("/categories/add", { name: categoryName });
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * ✅ Update a Category
 */
export const updateCategory = async (categoryId: number, categoryName: string): Promise<Category> => {
  try {
    const response = await axiosInstance.put(`/categories/update/${categoryId}`, { name: categoryName });
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * ✅ Delete a Category
 */
export const deleteCategory = async (categoryId: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/categories/delete/${categoryId}`);
  } catch (error) {
    throw handleApiError(error);
  }
};
