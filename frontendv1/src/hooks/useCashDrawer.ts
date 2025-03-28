"use client";

import { useState, useEffect, useCallback } from "react";
import { getAllCashDrawers, updateActualCashCollected, updateClosingBalanceAPI, CashDrawer } from "@/services/cashDrawer";
import { toast } from "sonner";

/**
 * ✅ Custom Hook for Managing Cash Drawers
 */
export const useCashDrawer = () => {
  const [cashDrawers, setCashDrawers] = useState<CashDrawer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * ✅ Fetch Cash Drawers
   */
  const fetchCashDrawers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllCashDrawers();
      setCashDrawers(data ?? []);
    } catch (error: any) {
      toast.error(`Error: ${error.message || "Failed to fetch cash drawers."}`);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCashDrawers();
  }, [fetchCashDrawers]);

  /**
   * ✅ Update Both Actual Cash Collected & Closing Balance in One Function
   */
  const updateCashDrawer = async (cashDrawerId: number, actualCollected?: number, closingBalance?: number) => {
    try {
      if (actualCollected !== undefined) {
        await updateActualCashCollected(cashDrawerId, actualCollected);
      }
      if (closingBalance !== undefined) {
        await updateClosingBalanceAPI(cashDrawerId, closingBalance);
      }

      toast.success("Cash drawer updated successfully.");
      fetchCashDrawers(); // ✅ Refresh data after update
    } catch (error: any) {
      toast.error(`Error: ${error.message || "Failed to update cash drawer."}`);
    }
  };

  return { cashDrawers, loading, error, fetchCashDrawers, updateCashDrawer };
};
