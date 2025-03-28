import { axiosInstance, handleApiError } from "@/lib/apiService";

/**
 * ✅ Fetch Customers with Loyalty Points
 */
export const getCustomersWithLoyaltyPoints = async () => {
  try {
    const response = await axiosInstance.get("/customers-with-loyalty");
    return response.data?.data || [];
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

/**
 * ✅ Claim Loyalty Points
 */
export const claimLoyaltyPoints = async (customerId: number, pointsToClaim: number) => {
  try {
    const response = await axiosInstance.post("/claim-loyalty", {
      customer_id: customerId,
      points_to_claim: pointsToClaim,
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};
