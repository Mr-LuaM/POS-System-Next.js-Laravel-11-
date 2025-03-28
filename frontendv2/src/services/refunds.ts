import { axiosInstance, handleApiError } from "@/lib/apiService";

/**
 * ✅ Fetch Refunds
 */
export const getRefunds = async (): Promise<any[]> => {
  try {
    const response = await axiosInstance.get("/refunds");
    return response.data.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * ✅ Process Refund for a Sale
 */
export const processRefund = async (saleId: number): Promise<boolean> => {
  try {
    const response = await axiosInstance.post(`/refunds/${saleId}`);
    return response.data.success;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};
