"use client";

import { useState, useEffect } from "react";
import { fetchDiscounts, createDiscount, updateDiscount, deleteDiscount, Discount } from "@/services/discount";
import { toast } from "sonner";

/**
 * ✅ Hook for Managing Discounts
 */
export function useDiscounts() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDiscounts();
  }, []);

  /**
   * ✅ Load Discounts from API
   */
  const loadDiscounts = async () => {
    setLoading(true);
    try {
      const data = await fetchDiscounts();
      setDiscounts(data);
    } catch (error: any) {
      toast.error(`Error: ${error.message || "Failed to load discounts."}`);
    }
    setLoading(false);
  };

  /**
   * ✅ Add a New Discount
   */
  const handleAddDiscount = async (discountData: Omit<Discount, "id">) => {
    try {
      await createDiscount(discountData);
      toast.success("Discount added successfully.");
      loadDiscounts();
    } catch (error: any) {
      toast.error(`Error: ${error.message || "Failed to add discount."}`);
    }
  };

  /**
   * ✅ Update Existing Discount
   */
  const handleUpdateDiscount = async (id: number, discountData: Omit<Discount, "id">) => {
    try {
      await updateDiscount(id, discountData);
      toast.success("Discount updated successfully.");
      loadDiscounts();
    } catch (error: any) {
      toast.error(`Error: ${error.message || "Failed to update discount."}`);
    }
  };

  /**
   * ✅ Delete Discount
   */
  const handleDeleteDiscount = async (id: number) => {
    try {
      await deleteDiscount(id);
      toast.success("Discount deleted successfully.");
      loadDiscounts();
    } catch (error: any) {
      toast.error(`Error: ${error.message || "Failed to delete discount."}`);
    }
  };

  return {
    discounts,
    loading,
    handleAddDiscount,
    handleUpdateDiscount,
    handleDeleteDiscount,
    refreshDiscounts: loadDiscounts,
  };
}
