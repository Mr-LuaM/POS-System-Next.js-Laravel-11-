import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
const BASE_URL = `${API_URL}/api/stores`; // ✅ Correct API route

// ✅ Get token from storage
const getAuthToken = () => sessionStorage.getItem("token") || localStorage.getItem("token");

// ✅ Axios instance with Authorization header
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// ✅ Add auth token before requests
axiosInstance.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ✅ Generic API Error Handler (Returns Validation Errors if any)
const handleApiError = (error: any) => {
  console.error("API Error:", error?.response || error);

  if (error.response?.status === 422 && error.response?.data?.errors) {
    return error.response.data.errors; // ✅ Return validation errors
  }

  throw new Error(error.response?.data?.message || "An error occurred.");
};

/**
 * ✅ Fetch all stores
 */
export const getStores = async () => {
  try {
    const response = await axiosInstance.get("/");
    return response.data.stores;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * ✅ Add a new store
 */
export const addStore = async (storeData: { name: string; location?: string }) => {
  try {
    const response = await axiosInstance.post("/create", storeData);
    return response.data.store;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * ✅ Update a store
 */
export const updateStore = async (storeId: number, storeData: { name: string; location?: string }) => {
  try {
    const response = await axiosInstance.put(`/update/${storeId}`, storeData);
    return response.data.store;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * ✅ Delete a store
 */
export const deleteStore = async (storeId: number) => {
  try {
    await axiosInstance.delete(`/delete/${storeId}`);
  } catch (error) {
    throw handleApiError(error);
  }
};
