"use client";
import { useState, useEffect, useCallback } from "react";
import { getProducts, Product } from "@/services/products";
import { getUserStoreId } from "@/lib/auth"; // ✅ Fetch store_id dynamically
import { toast } from "sonner";
import { debounce } from "lodash"; // ✅ Import debounce function

/**
 * ✅ Custom Hook for Fetching Products (Store-Specific)
 */
export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [storeId, setStoreId] = useState<number | null>(null);

  /**
   * ✅ Fetch Store ID for Cashier/Manager (Once)
   */
  useEffect(() => {
    const fetchStoreId = async () => {
      const id = await getUserStoreId();
      setStoreId(id);
    };
    fetchStoreId();
  }, []);

  /**
   * ✅ Fetch Products from API (Filtered by Store ID)
   */
  const fetchProducts = useCallback(
    debounce(async () => {
      if (!storeId) return; // ✅ Prevent fetching until storeId is available
      setLoading(true);
      setIsError(false);
      try {
        const data = await getProducts(searchQuery, storeId);
        setProducts(data);
      } catch (error: any) {
        toast.error(`Error: ${error.message || "Failed to fetch products."}`);
        setIsError(true);
      } finally {
        setLoading(false);
      }
    }, 300), // ✅ Debounce search to reduce API calls
    [searchQuery, storeId]
  );

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    isError,
    searchQuery,
    setSearchQuery,
    refreshProducts: fetchProducts,
  };
};
