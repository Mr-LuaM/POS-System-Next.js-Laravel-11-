import { axiosInstance, handleApiError } from "@/lib/apiService";

/**
 * ✅ Sale Type Definition
 */
export type Sale = {
  id: number;
  store_name: string;
  cashier_name: string;
  customer_name?: string;
  total_amount: number;
  status: "completed" | "pending" | "refunded";
  payment_methods: string[]; // Array of payment methods used
  created_at: string;
};

/**
 * ✅ Fetch Sales Transactions
 */
export const getSales = async (): Promise<Sale[]> => {
  try {
    const response = await axiosInstance.get("/sales");
    return response.data.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const getSaleItems = async (saleId: number) => {
  try {
    const response = await axiosInstance.get(`/sales/${saleId}/items`);
    return response.data.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};
export const processRefund = async (saleId: number): Promise<boolean> => {
  try {
    await axiosInstance.post(`/sales/${saleId}/refund`);
    return true;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};