import { axiosInstance, handleApiError } from "@/lib/apiService";

/**
 * ✅ Fetch Sales Report with Filters
 */
export const getSalesReport = async (filters: any): Promise<any> => {
  try {
    const response = await axiosInstance.get("/reports/sales", { params: filters });
    return response.data.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};
