"use client";

import { useState, useEffect, useCallback } from "react";
import { getCategories } from "@/services/category";
import { getStores } from "@/services/stores";
import { getSuppliers } from "@/services/suppliers";
import { toast } from "sonner";

/**
 * ✅ Fetch Stores, Categories, and Suppliers for Filtering (API Calls)
 */
export const useInventoryFilters = () => {
  const [stores, setStores] = useState<{ id: string; name: string }[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [suppliers, setSuppliers] = useState<{ id: string; name: string }[]>([]);
  const [selectedStore, setSelectedStore] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSupplier, setSelectedSupplier] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  // ✅ Fetch Filters from Backend
  const fetchFilters = useCallback(async () => {
    setLoading(true);
    setIsError(false);
    try {
      console.log("📡 Fetching Inventory Filters...");

      const [storesData, categoriesData, suppliersData] = await Promise.all([
        getStores("false"), // ✅ Fetch only active stores
        getCategories(),
        getSuppliers(false), // ✅ Fetch only active suppliers
      ]);

      console.log("✅ Fetched Stores:", storesData);
      console.log("✅ Fetched Categories:", categoriesData);
      console.log("✅ Fetched Suppliers:", suppliersData);

      const updatedStores = [{ id: "all", name: "All Stores" }, ...storesData];
      const updatedCategories = [{ id: "all", name: "All Categories" }, ...categoriesData];
      const updatedSuppliers = [{ id: "all", name: "All Suppliers" }, ...suppliersData];

      setStores(updatedStores);
      setCategories(updatedCategories);
      setSuppliers(updatedSuppliers);

      // ✅ Reset selected filters if they are no longer valid
      if (!updatedStores.some((s) => s.id === selectedStore)) setSelectedStore("all");
      if (!updatedCategories.some((c) => c.id === selectedCategory)) setSelectedCategory("all");
      if (!updatedSuppliers.some((s) => s.id === selectedSupplier)) setSelectedSupplier("all");

    } catch (error: any) {
      toast.error(`❌ Error: ${error.message || "Failed to fetch filters."}`);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  }, [selectedStore, selectedCategory, selectedSupplier]);

  useEffect(() => {
    fetchFilters();
  }, [fetchFilters]);

  return {
    stores,
    categories,
    suppliers,
    selectedStore,
    setSelectedStore,
    selectedCategory,
    setSelectedCategory,
    selectedSupplier,
    setSelectedSupplier,
    loading,
    isError,
    refreshFilters: fetchFilters, // ✅ Allows manual refresh
  };
};
