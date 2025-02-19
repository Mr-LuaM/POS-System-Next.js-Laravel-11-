"use client";

import { useState, useEffect, useCallback } from "react";
import { getCategories } from "@/services/category";
import { getStores } from "@/services/stores";
import { getSuppliers } from "@/services/suppliers";
import { toast } from "sonner";

/**
 * ✅ Fetch Stores, Categories, Suppliers for Inventory Filters
 */
export const useInventoryFilters = () => {
  const [stores, setStores] = useState<{ id: string; name: string }[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [suppliers, setSuppliers] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  const fetchFilters = useCallback(async () => {
    setLoading(true);
    setIsError(false);

    try {
      const [storesData, categoriesData, suppliersData] = await Promise.all([
        getStores(),
        getCategories(),
        getSuppliers(),
      ]);

      console.log("Fetched Stores:", storesData);
      console.log("Fetched Categories:", categoriesData);
      console.log("Fetched Suppliers:", suppliersData);

      setStores([{ id: "all", name: "All Stores" }, ...storesData]);
      setCategories([{ id: "all", name: "All Categories" }, ...categoriesData]);
      setSuppliers([{ id: "all", name: "All Suppliers" }, ...suppliersData]);
    } catch (error: any) {
      toast.error(`Error: ${error.message || "Failed to fetch filters."}`);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFilters();
  }, [fetchFilters]);

  return {
    stores,
    categories,
    suppliers,
    loading,
    isError,
    refreshFilters: fetchFilters,
  };
};
