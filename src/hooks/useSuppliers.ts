"use client";

import { useState, useEffect, useCallback } from "react";
import { getSuppliers, addSupplier, updateSupplier, deleteSupplier } from "@/services/suppliers";
import { toast } from "sonner";

/**
 * ✅ Type Definition for Supplier
 */
interface Supplier {
  id?: number;
  name: string;
  contact: string;
  email?: string;
  address?: string;
}

/**
 * ✅ Custom Hook for Managing Suppliers (TOAST HANDLING HERE ONLY)
 */
export const useSuppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);

  /**
   * ✅ Fetch Suppliers from API (Handles Toasts)
   */
  const fetchSuppliers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getSuppliers();
      setSuppliers(data || []);
    } catch (error: any) {
      toast.error(`Fetching failed: ${error.message || "Failed to fetch suppliers."}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  /**
   * ✅ Add or Update Supplier (Handles Toasts)
   */
  const saveSupplier = async (supplierData: any, id?: number) => {
    try {
      if (id) {
        await updateSupplier(id, supplierData);
        toast.success("Supplier updated successfully.");
      } else {
        await addSupplier(supplierData);
        toast.success("Supplier added successfully.");
      }
      fetchSuppliers(); // ✅ Refresh supplier list after saving
    } catch (error: any) {
      if (error?.email) {
        error.email.forEach((err: string) => toast.error(`Saving failed: ${err}`)); // ✅ Show validation errors
      } else {
        toast.error(`Saving failed: ${error.message || "An error occurred."}`);
      }
    }
  };

  /**
   * ✅ Delete Supplier (Handles Toasts)
   */
  const handleDeleteSupplier = async (id: number) => {
    try {
      await deleteSupplier(id);
      fetchSuppliers();
      toast.success("Supplier deleted successfully.");
    } catch (error: any) {
      toast.error(`Deletion failed: ${error.message || "Failed to delete supplier."}`);
    }
  };

  return {
    suppliers,
    loading,
    saveSupplier,
    handleDeleteSupplier,
    refreshSuppliers: fetchSuppliers,
  };
};
