import { axiosInstance, handleApiError } from "@/lib/apiService";

/**
 * ✅ Transaction Request Payload Type
 */
export interface TransactionRequest {
  cashier_id: number;
  store_id: number;
  customer_id?: number | null;
  payment_methods: { method: string; amount: number; change: number }[];
  items: { product_id: number; quantity: number; price: number }[];
}

/**
 * ✅ Transaction Response Type
 */
export interface TransactionResponse {
  success: boolean;
  message: string;
  sale_id?: number;
  change?: number;
}

/**
 * ✅ Process a New Transaction
 */
export const processTransactionApi = async (
  transactionData: TransactionRequest
): Promise<TransactionResponse> => {
  try {
    const { data } = await axiosInstance.post<TransactionResponse>(
      "/transaction/complete",
      transactionData
    );
    return data;
  } catch (error) {
    return { success: false, message: handleApiError(error) };
  }
};
