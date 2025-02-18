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
    } catch (error: any) {
      toast.error(`Fetching failed: ${error.message || "Failed to fetch stores."}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const saveStore = async (storeData: { name: string; location?: string }, id?: number) => {
    try {
      if (id) {
        await updateStore(id, storeData);
        toast.success("Store updated successfully.");
      } else {
        await addStore(storeData);
        toast.success("Store added successfully.");
      }
      fetchStores(); // ✅ Refresh store list after saving
    } catch (error: any) {
      if (error?.name) {
        error.name.forEach((err: string) => toast.error(`Saving failed: ${err}`)); // ✅ Show validation errors
      } else {
        toast.error(`Saving failed: ${error.message || "An error occurred."}`);
      }
    }
  };

  // ✅ Delete store
  const handleDeleteStore = async (id: number) => {
    try {
      await deleteStore(id);
      fetchStores();
      toast.success("Store deleted successfully.");
    } catch (error: any) {
      toast.error(`Deletion failed: ${error.message || "Failed to delete store."}`);
    }
  };

  return { stores, loading, saveStore, handleDeleteStore, refreshStores: fetchStores };
};
