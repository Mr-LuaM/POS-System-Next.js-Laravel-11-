import { axiosInstance, handleApiError } from "@/lib/apiService";

/**
 * ✅ Define Payment Type
 */
export type Payment = {
  id: number;
  sale_id: number;
  amount: number;
  method: string;
  transaction_id?: string | null;
  created_at: string;
  updated_at: string;
};

/**
 * ✅ Fetch Payments
 */
export const getPayments = async (): Promise<Payment[]> => {
  try {
    const response = await axiosInstance.get("/payments");
    return response.data.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};
