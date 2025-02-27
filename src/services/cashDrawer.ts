"use client";

import { axiosInstance, handleApiError } from "@/lib/apiService";

export interface CashDrawer {
  id: number;
  store_id: number;
  opening_balance: number;
  closing_balance: number | null;
  actual_cash_collected?: number | null;
  total_collected: number;
  total_sales: number;
  total_change_given: number;
  variance: number;
  status: string;
}

/**
 * ✅ Fetch All Cash Drawers
 */
export const getAllCashDrawers = async (): Promise<CashDrawer[]> => {
  const storeId = getStoredStoreId();
  if (!storeId) throw new Error("Store ID is missing. Please select a store.");

  try {
    const response = await axiosInstance.get(`/store/${storeId}/cash-drawers`);
    return response.data.data ?? [];
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * ✅ Get Store ID from Session Storage
 */
const getStoredStoreId = (): number | null => {
  if (typeof window !== "undefined") {
    const storeId = sessionStorage.getItem("storeId");
    return storeId ? parseInt(storeId, 10) : null;
  }
  return null;
};

/**
 * ✅ Fetch Cash Drawer Status
 */
export const getCashDrawerStatus = async (): Promise<CashDrawer> => {
  const storeId = getStoredStoreId();
  if (!storeId) throw new Error("Store ID is missing. Please select a store.");

  try {
    const response = await axiosInstance.get(`/store/${storeId}/cash-status`);
    return response.data.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * ✅ Update Actual Cash Collected (For Cashier)
 */
export const updateActualCashCollected = async (cashDrawerId: number, amount: number): Promise<void> => {
  try {
    await axiosInstance.post(`/store/cash-drawer/${cashDrawerId}/update-actual-cash`, {
      actual_cash_collected: amount, // ✅ Send the amount in the request body
    });
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * ✅ Update Closing Balance (For Admin)
 */
export const updateClosingBalanceAPI = async (cashDrawerId: number, closingBalance: number): Promise<void> => {
  try {
    await axiosInstance.post(`/store/cash-drawer/${cashDrawerId}/update-closing-balance`, {
      closing_balance: closingBalance, // ✅ Send the closing balance in the request body
    });
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};
