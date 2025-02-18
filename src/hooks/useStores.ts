"use client";

import { useState, useEffect, useCallback } from "react";
import { getStores, addStore, updateStore, deleteStore } from "@/services/stores";
import { toast } from "sonner";

export const useStores = () => {
  const [stores, setStores] = useState<{ id: number; name: string; location?: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // ✅ Fetch stores from API
  const fetchStores = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getStores();
      setStores(data);
    } catch (error) {
      toast.error("Failed to fetch stores");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  // ✅ Add store
  const handleAddStore = async (storeData: { name: string; location?: string }) => {
    try {
      await addStore(storeData);
      toast.success("Store added successfully");
      fetchStores();
    } catch {
      toast.error("Failed to add store");
    }
  };

  // ✅ Update store
  const handleUpdateStore = async (id: number, storeData: { name: string; location?: string }) => {
    try {
      await updateStore(id, storeData);
      toast.success("Store updated successfully");
      fetchStores();
    } catch {
      toast.error("Failed to update store");
    }
  };

  // ✅ Delete store
  const handleDeleteStore = async (id: number) => {
    try {
      await deleteStore(id);
      toast.success("Store deleted successfully");
      fetchStores();
    } catch {
      toast.error("Failed to delete store");
    }
  };

  return { stores, loading, handleAddStore, handleUpdateStore, handleDeleteStore };
};
