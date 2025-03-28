import { useState } from "react";
import { getAnalyticsData } from "@/services/analytics";

export const useAnalytics = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchAnalytics = async (filters: {
    start_date: string;
    end_date: string;
    store_id?: string;
  }) => {
    setLoading(true);
    try {
      const data = await getAnalyticsData(filters);
      setAnalytics(data?.data);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  return { analytics, loading, fetchAnalytics };
};
