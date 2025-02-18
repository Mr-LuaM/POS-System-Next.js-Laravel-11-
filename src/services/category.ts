import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

// ✅ Get token from storage
const getAuthToken = () => sessionStorage.getItem("token") || localStorage.getItem("token");

// ✅ Axios instance with Authorization header
const axiosInstance = axios.create({
  baseURL: `${API_URL}/api`,
  headers: { "Content-Type": "application/json" },
});

// ✅ Add auth token before requests
axiosInstance.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/**
 * ✅ Fetch all categories
 */
export const getCategories = async () => {
  try {
    const response = await axiosInstance.get("/categories");
    return response.data.categories; // Return only categories
  } catch (error) {
    throw new Error("Error fetching categories");
  }
};

/**
 * ✅ Add a new category
 */
export const addCategory = async (categoryName: string) => {
  try {
    const response = await axiosInstance.post("/categories/add", { name: categoryName });
    return response.data.category; // Return added category
  } catch (error) {
    throw new Error("Error adding category");
  }
};

/**
 * ✅ Update a category
 */
export const updateCategory = async (categoryId: number, categoryName: string) => {
  try {
    const response = await axiosInstance.put(`/categories/update/${categoryId}`, { name: categoryName });
    return response.data.category; // Return updated category
  } catch (error) {
    throw new Error("Error updating category");
  }
};

/**
 * ✅ Delete a category
 */
export const deleteCategory = async (categoryId: number) => {
  try {
    await axiosInstance.delete(`/categories/delete/${categoryId}`);
  } catch (error) {
    throw new Error("Error deleting category");
  }
};
