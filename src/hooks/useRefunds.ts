"use client";

import { useState, useEffect, useCallback } from "react";
import { getRefunds } from "@/services/refunds";
import { toast } from "sonner";

/**
 * ✅ Custom Hook for Managing Refund Data
 */
export const useRefunds = () => {
  const [refunds, setRefunds] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  /**
   * ✅ Fetch Refunds (Manual & Auto Refresh)
   */
  const fetchRefunds = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getRefunds();
      setRefunds(data);
    } catch (error: any) {
      toast.error(`❌ Failed to fetch refunds: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRefunds();
  }, [fetchRefunds]);

  return {
    refunds,
    refreshRefunds: fetchRefunds,
    loading,
  };
};
