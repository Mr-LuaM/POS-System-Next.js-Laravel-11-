import { useState, useEffect } from "react";
import { getCategories, addCategory, updateCategory, deleteCategory } from "@/services/category";
import { toast } from "sonner";

export const useCategories = () => {
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (categoryName: string) => {
    try {
      const newCategory = await addCategory(categoryName);
      setCategories((prev) => [...prev, newCategory]); // Optimistic UI update
      toast.success("Category added successfully");
    } catch (error) {
      toast.error("Failed to add category");
    }
  };

  const handleUpdateCategory = async (id: number, categoryName: string) => {
    try {
      await updateCategory(id, categoryName);
      setCategories((prev) => prev.map((cat) => (cat.id === id ? { ...cat, name: categoryName } : cat)));
      toast.success("Category updated successfully");
    } catch (error) {
      toast.error("Failed to update category");
    }
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
      toast.success("Category deleted successfully");
    } catch (error) {
      toast.error("Failed to delete category");
    }
  };

  return { categories, loading, handleAddCategory, handleUpdateCategory, handleDeleteCategory };
};
