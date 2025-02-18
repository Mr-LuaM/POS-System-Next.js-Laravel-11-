"use client";

import { useState, useEffect, useCallback } from "react";
import { getCategories, addCategory, updateCategory, deleteCategory } from "@/services/category";
import { toast } from "sonner";

export const useCategories = () => {
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  // ✅ Fetch categories from API (memoized to avoid unnecessary re-creations)
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setIsError(false);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to fetch categories");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // ✅ Add category & update state without re-fetching everything
  const handleAddCategory = async (categoryName: string) => {
    try {
      const newCategory = await addCategory(categoryName);
      setCategories((prev) => [...prev, newCategory]); // Update state directly
      toast.success("Category added successfully");
    } catch (error) {
      console.error("Add error:", error);
      toast.error("Failed to add category");
    }
  };

  // ✅ Update category & update state without full re-fetch
  const handleUpdateCategory = async (id: number, categoryName: string) => {
    try {
      await updateCategory(id, categoryName);
      setCategories((prev) =>
        prev.map((cat) => (cat.id === id ? { ...cat, name: categoryName } : cat))
      );
      toast.success("Category updated successfully");
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update category");
    }
  };

  // ✅ Delete category & update state without full re-fetch
  const handleDeleteCategory = async (id: number) => {
    try {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
      toast.success("Category deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
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
    refreshCategories: fetchCategories, // ✅ Expose `refreshCategories`
  };
};
