"use client";

import { useState, useEffect, useCallback } from "react";
import { getStores, addStore, updateStore, deleteStore, Store } from "@/services/stores";
import { toast } from "sonner";

/**
 * ✅ Custom Hook for Managing Stores
 */
export const useStores = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  /**
   * ✅ Fetch Stores from API
   */
  const fetchStores = useCallback(async () => {
    setLoading(true);
    setIsError(false);
    try {
      const data = await getStores();
      setStores(data);
    } catch (error: any) {
      toast.error(`Error: ${error.message || "Failed to fetch stores."}`);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  /**
   * ✅ Add or Update Store (With Validation & Auto-Refresh)
   */
  const saveStore = async (storeData: Omit<Store, "id">, id?: number): Promise<boolean> => {
    try {
      if (id) {
        await updateStore(id, storeData);
        toast.success("Success: Store updated successfully.");
      } else {
        await addStore(storeData);
        toast.success("Success: Store added successfully.");
      }
      fetchStores(); // ✅ Auto-refresh after save
      return true;
    } catch (error: any) {
      toast.error(`Error: ${error.message || "Failed to save store."}`);
      return false;
    }
  };

  /**
   * ✅ Delete Store (With Auto-Refresh)
   */
  const handleDeleteStore = async (id: number) => {
    try {
      await deleteStore(id);
      toast.success("Success: Store deleted successfully.");
      fetchStores();
    } catch (error: any) {
      toast.error(`Error: ${error.message || "Failed to delete store."}`);
    }
  };

  return { stores, loading, isError, saveStore, handleDeleteStore, refreshStores: fetchStores };
};
