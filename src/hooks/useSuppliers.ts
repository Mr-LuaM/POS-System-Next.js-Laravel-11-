"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  getSuppliers, 
  addSupplier, 
  updateSupplier, 
  deleteSupplier, 
  archiveSupplier, 
  restoreSupplier, 
  Supplier 
} from "@/services/suppliers";
import { toast } from "sonner";

/**
 * ✅ Custom Hook for Managing Suppliers (Supports Active & Archived Suppliers)
 */
export const useSuppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [archivedFilter, setArchivedFilter] = useState<string | null>(null); // ✅ NULL = fetch all suppliers

  /**
   * ✅ Fetch Suppliers from API (Supports Active, Archived & All Suppliers)
   */
  const fetchSuppliers = useCallback(async () => {
    setLoading(true);
    setIsError(false);
    try {
      const data = await getSuppliers(archivedFilter); // ✅ Pass filter dynamically
      setSuppliers(data);
    } catch (error: any) {
      toast.error(`Error: ${error.message || "Failed to fetch suppliers."}`);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  }, [archivedFilter]);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  /**
   * ✅ Add or Update Supplier (With Validation & Auto-Refresh)
   */
  const saveSupplier = async (supplierData: Partial<Supplier>, id?: number): Promise<boolean> => {
    try {
      if (id) {
        await updateSupplier(id, supplierData);
        toast.success("Success: Supplier updated successfully.");
      } else {
        await addSupplier(supplierData as Supplier);
        toast.success("Success: Supplier added successfully.");
      }
      fetchSuppliers();
      return true;
    } catch (error: any) {
      toast.error(`Error: ${error.message || "Failed to save supplier."}`);
      return false;
    }
  };

  /**
   * ✅ Archive (Soft Delete) Supplier
   */
  const handleArchiveSupplier = async (id: number) => {
    try {
      await archiveSupplier(id);
      toast.success("Success: Supplier archived successfully.");
      fetchSuppliers();
    } catch (error: any) {
      toast.error(`Error: ${error.message || "Failed to archive supplier."}`);
    }
  };

  /**
   * ✅ Restore Supplier
   */
  const handleRestoreSupplier = async (id: number) => {
    try {
      await restoreSupplier(id);
      toast.success("Success: Supplier restored successfully.");
      fetchSuppliers();
    } catch (error: any) {
      toast.error(`Error: ${error.message || "Failed to restore supplier."}`);
    }
  };

  /**
   * ✅ Permanently Delete Supplier (Only if Archived)
   */
  const handleDeleteSupplier = async (id: number) => {
    try {
      await deleteSupplier(id);
      toast.success("Success: Supplier permanently deleted.");
      fetchSuppliers();
    } catch (error: any) {
      toast.error(`Error: ${error.message || "Failed to delete supplier."}`);
    }
  };

  return {
    suppliers,
    loading,
    isError,
    saveSupplier,
    handleArchiveSupplier,
    handleRestoreSupplier,
    handleDeleteSupplier,
    refreshSuppliers: fetchSuppliers,
    archivedFilter, // ✅ Expose archived filter
    setArchivedFilter, // ✅ Expose filter setter
  };
};
