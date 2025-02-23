"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { getSalesReport } from "@/services/report";

export const useSalesReport = () => {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchSalesReport = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const data = await getSalesReport(filters);
      setReport(data);
    } catch (error: any) {
      toast.error(`❌ Failed to fetch sales report: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    report,
    loading,
    fetchSalesReport,
  };
};
