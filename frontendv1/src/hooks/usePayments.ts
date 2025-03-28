"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { getPayments } from "@/services/payments";

/**
 * ✅ Custom Hook for Managing Payments
 */
export const usePayments = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  /**
   * ✅ Fetch Payments
   */
  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getPayments();
      setPayments(data);
    } catch (error: any) {
      toast.error(`❌ Failed to fetch payments: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  return {
    payments,
    refreshPayments: fetchPayments,
    loading,
  };
};
