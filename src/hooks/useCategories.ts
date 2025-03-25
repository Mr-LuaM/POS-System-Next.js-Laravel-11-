"use client";

import { useState, useEffect, useCallback } from "react";
import { getCategories, addCategory, updateCategory, deleteCategory, Category } from "@/services/category";
import { toast } from "sonner";

/**
 * ✅ Custom Hook for Managing Categories (Consistent API Handling)
 */
export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  /**
   * ✅ Fetch Categories from API
   */
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setIsError(false);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error: any) {
      toast.error(`Error: ${error.message || "Failed to fetch categories."}`);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  /**
   * ✅ Add Category (With Validation & Auto-Refresh)
   */
  const handleAddCategory = async (categoryName: string) => {
    const trimmedName = categoryName.trim();
    if (!trimmedName) {
      toast.error("Error: Category name cannot be empty.");
      return;
    }

    try {
      await addCategory(trimmedName);
      toast.success("Success: Category added successfully.");
      fetchCategories();
    } catch (error: any) {
      toast.error(`Error: ${error.message || "Failed to add category."}`);
    }
  };

  /**
   * ✅ Update Category (With Auto-Refresh)
   */
  const handleUpdateCategory = async (id: number, categoryName: string) => {
    const trimmedName = categoryName.trim();
    if (!trimmedName) {
      toast.error("Error: Category name cannot be empty.");
      return;
    }

    try {
      await updateCategory(id, trimmedName);
      toast.success("Success: Category updated successfully.");
      fetchCategories();
    } catch (error: any) {
      toast.error(`Error: ${error.message || "Failed to update category."}`);
    }
  };

  /**
   * ✅ Delete Category (With Auto-Refresh)
   */
  const handleDeleteCategory = async (id: number) => {
    try {
      await deleteCategory(id);
      toast.success("Success: Category deleted successfully.");
      fetchCategories();
    } catch (error: any) {
      toast.error(`Error: ${error.message || "Failed to delete category."}`);
    }
  };

  return {
    categories,
    loading,
    isError,
    handleAddCategory,
    handleUpdateCategory,
    handleDeleteCategory,
    refreshCategories: fetchCategories,
  };
};
