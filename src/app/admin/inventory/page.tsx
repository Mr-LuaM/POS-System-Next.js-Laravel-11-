"use client";

import { DataTable } from "@/components/common/data-table";
import { columns } from "./columns"; // ✅ Correct import
import { useCategories } from "@/hooks/useCategories";

/**
 * ✅ Categories Page with Table
 */
export default function CategoriesPage() {
  const { categories, loading, handleUpdateCategory, handleDeleteCategory } = useCategories();

  if (loading) return <p className="text-gray-700 dark:text-gray-300">Loading categories...</p>;

  return <DataTable columns={columns(handleUpdateCategory, handleDeleteCategory)} data={categories} searchKey="name" />;
}
