"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { getSales, Sale,processRefund } from "@/services/sales";

/**
 * ✅ Custom Hook for Managing Sales Data
 */
export const useSales = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const role = sessionStorage.getItem("role");

  /**
   * ✅ Fetch Sales Transactions (Manual Refresh)
   */
  const fetchSales = useCallback(async () => {
    setLoading(true);
    try {
      const salesData = await getSales();
      setSales(salesData);
    } catch (error: any) {
      toast.error(`❌ Failed to fetch sales: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * ✅ Process Refund (Admin & Manager Only)
   */
  const refundSale = async (saleId: number): Promise<boolean> => {
    if (role !== "admin" && role !== "manager") {
      toast.error("❌ Unauthorized: Only admins & managers can process refunds.");
      return false;
    }

    try {
      await processRefund(saleId);
      toast.success(`✅ Refund processed successfully for Sale #${saleId}.`);
      fetchSales(); // Refresh sales list
      return true;
    } catch (error: any) {
      toast.error(`❌ Refund failed: ${error.message}`);
      return false;
    }
  };
  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  return {
    sales,
    refundSale,
    refreshSales: fetchSales,
    loading,
  };
  
};
