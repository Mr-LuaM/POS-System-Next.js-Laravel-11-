import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

/**
 * ✅ Get Auth Token (Avoids Redundant Calls)
 */
const getAuthToken = () => sessionStorage.getItem("token") || localStorage.getItem("token");

/**
 * ✅ Axios Instance with Authorization
 */
export const axiosInstance = axios.create({
  baseURL: `${API_URL}/api`,
  headers: { "Content-Type": "application/json" },
});

/**
 * ✅ Attach Authorization Token to Every Request
 */
axiosInstance.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/**
 * ✅ Centralized API Error Handler (Handles Validation Errors)
 */
import { toast } from "sonner";

/**
 * ✅ Handles API Errors & Shows Toast
 */
export const handleApiError = (error: any): string => {
  let errorMessage = "An unexpected error occurred. Please try again.";

  if (error.response) {
    const { data, status } = error.response;

    if (status === 422 && data.errors) {
      // ✅ Show detailed validation errors
      errorMessage = Object.values(data.errors).flat().join(" ");
    } else if (data.message) {
      errorMessage = data.message;
    }
  } else if (error.message) {
    errorMessage = error.message;
  }

  // toast.error(errorMessage); // ✅ Ensure error message appears in Toast
  return errorMessage;
};

