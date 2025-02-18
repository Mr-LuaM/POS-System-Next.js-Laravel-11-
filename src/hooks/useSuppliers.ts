"use client";

import { useState, useEffect, useCallback } from "react";
import { getSuppliers, addSupplier, updateSupplier, deleteSupplier } from "@/services/suppliers";
import { toast } from "sonner";

export const useSuppliers = () => {
  const [suppliers, setSuppliers] = useState<{ id: number; name: string; contact: string; email?: string; address?: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  // ✅ Fetch suppliers from API
  const fetchSuppliers = useCallback(async () => {
    setLoading(true);
    setIsError(false);
    try {
      const data = await getSuppliers();
      setSuppliers(data);
    } catch (error) {
      toast.error("Failed to fetch suppliers");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  // ✅ Add supplier
  const handleAddSupplier = async (supplierData: { name: string; contact: string; email?: string; address?: string }) => {
    if (!supplierData.name.trim() || !supplierData.contact.trim()) {
      toast.error("Name and Contact are required.");
      return;
    }

    try {
      await addSupplier(supplierData);
      toast.success("Supplier added successfully");
      fetchSuppliers();
    } catch {
      toast.error("Failed to add supplier");
    }
  };

  // ✅ Update supplier
  const handleUpdateSupplier = async (id: number, supplierData: { name: string; contact: string; email?: string; address?: string }) => {
    if (!supplierData.name.trim() || !supplierData.contact.trim()) {
      toast.error("Name and Contact are required.");
      return;
    }

    try {
      await updateSupplier(id, supplierData);
      toast.success("Supplier updated successfully");
      fetchSuppliers();
    } catch {
      toast.error("Failed to update supplier");
    }
  };

  // ✅ Delete supplier
  const handleDeleteSupplier = async (id: number) => {
    try {
      await deleteSupplier(id);
      toast.success("Supplier deleted successfully");
      fetchSuppliers();
    } catch {
      toast.error("Failed to delete supplier");
    }
  };

  return {
    suppliers,
    loading,
    isError,
    handleAddSupplier,
    handleUpdateSupplier,
    handleDeleteSupplier,
    refreshSuppliers: fetchSuppliers,
  };
};
