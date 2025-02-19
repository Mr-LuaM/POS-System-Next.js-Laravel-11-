"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getStores,
  addStore,
  updateStore,
  archiveStore,
  restoreStore,
  deleteStore,
  Store,
} from "@/services/stores";
import { toast } from "sonner";

/**
 * ✅ Custom Hook for Managing Stores (Supports Active & Archived Stores)
 */
export const useStores = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [archivedFilter, setArchivedFilter] = useState<string | null>(null); // ✅ NULL = fetch all stores

  /**
   * ✅ Fetch Stores from API (Supports Active, Archived & All Stores)
   */
  const fetchStores = useCallback(async () => {
    setLoading(true);
    setIsError(false);
    try {
      const data = await getStores(archivedFilter);
      setStores(data);
    } catch (error: any) {
      toast.error(`Error: ${error.message || "Failed to fetch stores."}`);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  }, [archivedFilter]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  /**
   * ✅ Add or Update Store (With Auto-Refresh)
   */
  const saveStore = async (storeData: Partial<Store>, id?: number): Promise<boolean> => {
    try {
      if (id) {
        await updateStore(id, storeData);
        toast.success("Success: Store updated successfully.");
      } else {
        await addStore(storeData as Store);
        toast.success("Success: Store added successfully.");
      }
      fetchStores(); // ✅ Auto-refresh
      return true;
    } catch (error: any) {
      toast.error(`Error: ${error.message || "Failed to save store."}`);
      return false;
    }
  };

  /**
   * ✅ Archive (Soft Delete) Store
   */
  const handleArchiveStore = async (id: number) => {
    try {
      await archiveStore(id);
      toast.success("Success: Store archived successfully.");
      fetchStores();
    } catch (error: any) {
      toast.error(`Error: ${error.message || "Failed to archive store."}`);
    }
  };

  /**
   * ✅ Restore Store
   */
  const handleRestoreStore = async (id: number) => {
    try {
      await restoreStore(id);
      toast.success("Success: Store restored successfully.");
      fetchStores();
    } catch (error: any) {
      toast.error(`Error: ${error.message || "Failed to restore store."}`);
    }
  };

  /**
   * ✅ Permanently Delete Store (Only if Archived)
   */
  const handleDeleteStore = async (id: number) => {
    try {
      await deleteStore(id);
      toast.success("Success: Store permanently deleted.");
      fetchStores();
    } catch (error: any) {
      toast.error(`Error: ${error.message || "Failed to delete store."}`);
    }
  };

  return {
    stores,
    loading,
    isError,
    saveStore,
    handleArchiveStore, // ✅ Now defined
    handleRestoreStore, // ✅ Now defined
    handleDeleteStore, // ✅ Now defined
    refreshStores: fetchStores,
    archivedFilter, // ✅ Expose archived filter
    setArchivedFilter, // ✅ Expose filter setter
  };
};
