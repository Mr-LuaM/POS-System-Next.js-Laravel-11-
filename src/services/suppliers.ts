import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

/**
 * ✅ Get Auth Token
 */
const getAuthToken = () => sessionStorage.getItem("token") || localStorage.getItem("token");

/**
 * ✅ Axios Instance with Authentication
 */
const axiosInstance = axios.create({
  baseURL: `${API_URL}/api`,
  headers: { "Content-Type": "application/json" },
});

/**
 * ✅ Attach Authorization Token to Requests
 */
axiosInstance.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/**
 * ✅ Generic API Error Handling (NO TOAST HERE)
 */
const handleApiError = (error: any) => {
  console.error("API Error:", error?.response || error);

  if (error.response?.status === 422 && error.response?.data?.errors) {
    return error.response.data.errors; // ✅ Return validation errors
  }

  throw new Error(error.response?.data?.message || "An error occurred.");
};

/**
 * ✅ Fetch All Suppliers (Returns Data Only)
 */
export const getSuppliers = async () => {
  try {
    const response = await axiosInstance.get("/suppliers");
    return response.data.suppliers;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * ✅ Add a New Supplier (Returns Data Only)
 */
export const addSupplier = async (supplierData: any) => {
  try {
    const response = await axiosInstance.post("/suppliers/add", supplierData);
    return response.data.supplier;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * ✅ Update a Supplier (Returns Data Only)
 */
export const updateSupplier = async (supplierId: number, supplierData: any) => {
  try {
    const response = await axiosInstance.put(`/suppliers/update/${supplierId}`, supplierData);
    return response.data.supplier;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * ✅ Delete a Supplier (Returns Data Only)
 */
export const deleteSupplier = async (supplierId: number) => {
  try {
    await axiosInstance.delete(`/suppliers/delete/${supplierId}`);
  } catch (error) {
    throw handleApiError(error);
  }
};
