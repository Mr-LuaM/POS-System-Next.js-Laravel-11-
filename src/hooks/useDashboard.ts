import { useState, useEffect } from "react";
import { getDashboardData } from "@/services/dashboard";

export function useDashboard() {
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const data = await getDashboardData();
      setDashboard(data.data); // ✅ Ensure we only return `data`
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return { dashboard, loading, fetchDashboard };
}
