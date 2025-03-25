import { axiosInstance, handleApiError } from "@/lib/apiService";

/**
 * ✅ Fetch Dashboard Data (with Optional Store ID)
 */
export const getDashboardData = async () => {
  try {
    // 🔹 Get store ID from session storage
    const storeId = sessionStorage.getItem("storeId");

    // 🔹 Prepare query params (if store ID exists, send it)
    const params = storeId ? { store_id: storeId } : {};

    // 🔹 Make API request (conditionally includes store_id)
    const response = await axiosInstance.get("/dashboard", { params });

    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};
