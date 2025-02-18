import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
const BASE_URL = `${API_URL}/api/stores`; // ✅ Matches Laravel routes

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

/**
 * ✅ Fetch all stores
 */
export const getStores = async () => {
  try {
    const response = await axiosInstance.get("/");
    return response.data.stores;
  } catch (error) {
    throw new Error("Error fetching stores");
  }
};

/**
 * ✅ Add a new store
 */
export const addStore = async (storeData: { name: string; location?: string }) => {
  try {
    const response = await axiosInstance.post("/add", storeData);
    return response.data.store;
  } catch (error) {
    throw new Error("Error adding store");
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
    throw new Error("Error updating store");
  }
};

/**
 * ✅ Delete a store
 */
export const deleteStore = async (storeId: number) => {
  try {
    await axiosInstance.delete(`/delete/${storeId}`);
  } catch (error) {
    throw new Error("Error deleting store");
  }
};
