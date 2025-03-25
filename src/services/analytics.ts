
import { axiosInstance, handleApiError } from "@/lib/apiService";

export const getAnalyticsData = async (filters: {
  start_date: string;
  end_date: string;
  store_id?: string;
}) => {
  try {
    const response = await axiosInstance.get("/analytics-report", { params: filters });
    return response.data;
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    throw error;
  }
};
