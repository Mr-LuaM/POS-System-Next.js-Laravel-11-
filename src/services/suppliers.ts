import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
const BASE_URL = `${API_URL}/api/suppliers`; // ✅ No /admin

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
 * ✅ Fetch all suppliers
 */
export const getSuppliers = async () => {
  try {
    const response = await axiosInstance.get("/");
    return response.data.suppliers;
  } catch (error) {
    throw new Error("Error fetching suppliers");
  }
};

/**
 * ✅ Add a new supplier
 */
export const addSupplier = async (supplierData: { name: string; contact: string; email?: string; address?: string }) => {
  try {
    const response = await axiosInstance.post("/add", supplierData);
    return response.data.supplier;
  } catch (error) {
    throw new Error("Error adding supplier");
  }
};

/**
 * ✅ Update a supplier
 */
export const updateSupplier = async (supplierId: number, supplierData: { name: string; contact: string; email?: string; address?: string }) => {
  try {
    const response = await axiosInstance.put(`/update/${supplierId}`, supplierData);
    return response.data.supplier;
  } catch (error) {
    throw new Error("Error updating supplier");
  }
};

/**
 * ✅ Delete a supplier
 */
export const deleteSupplier = async (supplierId: number) => {
  try {
    await axiosInstance.delete(`/delete/${supplierId}`);
  } catch (error) {
    throw new Error("Error deleting supplier");
  }
};
