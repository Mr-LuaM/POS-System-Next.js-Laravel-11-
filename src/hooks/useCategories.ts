"use client";

import { useState, useEffect, useCallback } from "react";
import { getCategories, addCategory, updateCategory, deleteCategory } from "@/services/category";
import { toast } from "sonner";

export const useCategories = () => {
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  // ✅ Fetch categories from API (Optimized)
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setIsError(false);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch categories");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // ✅ Add category (Auto-Refresh Table)
  const handleAddCategory = async (categoryName: string) => {
    const trimmedName = categoryName.trim();
    if (!trimmedName) {
      toast.error("Category name cannot be empty.");
      return;
    }

    try {
      await addCategory(trimmedName);
      toast.success("Category added successfully");
      fetchCategories(); // ✅ Auto-refresh table
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error("Failed to add category");
    }
  };

  // ✅ Update category (Auto-Refresh Table)
  const handleUpdateCategory = async (id: number, categoryName: string) => {
    const trimmedName = categoryName.trim();
    if (!trimmedName) {
      toast.error("Category name cannot be empty.");
      return;
    }

    try {
      await updateCategory(id, trimmedName);
      toast.success("Category updated successfully");
      fetchCategories(); // ✅ Auto-refresh table
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Failed to update category");
    }
  };

  // ✅ Delete category (Auto-Refresh Table)
  const handleDeleteCategory = async (id: number) => {
    try {
      await deleteCategory(id);
      toast.success("Category deleted successfully");
      fetchCategories(); // ✅ Auto-refresh table
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category");
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
