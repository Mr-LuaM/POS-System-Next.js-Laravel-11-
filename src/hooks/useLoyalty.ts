import { useState, useEffect } from "react";
import { getCustomersWithLoyaltyPoints, claimLoyaltyPoints } from "@/services/loyaltyService";

/**
 * ✅ Custom Hook for Managing Loyalty Points
 */
export const useLoyalty = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * ✅ Fetch Customers with Loyalty Points
   */
  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCustomersWithLoyaltyPoints();
      setCustomers(data);
    } catch (err) {
      setError("Failed to fetch customers");
    } finally {
      setLoading(false);
    }
  };

  /**
   * ✅ Claim Loyalty Points
   */
  const handleClaimPoints = async (customerId: number, pointsToClaim: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await claimLoyaltyPoints(customerId, pointsToClaim);
      // ✅ Refresh customers list after successful claim
      fetchCustomers();
      return response;
    } catch (err) {
      setError("Failed to claim points");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return { customers, loading, error, fetchCustomers, handleClaimPoints };
};
