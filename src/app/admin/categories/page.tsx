"use client";

import { DataTable } from "@/components/common/data-table";
import { getCategoryColumns } from "./columns"; // ✅ Uses corrected function
import { useCategories } from "@/hooks/useCategories";

/**
 * ✅ Categories Page with Table
 */
export default function CategoriesPage() {
  const { categories, loading, handleUpdateCategory, handleDeleteCategory } = useCategories();

  if (loading) return <p className="text-muted-foreground">Loading categories...</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Categories</h1>

      {/* ✅ Categories Table */}
      <DataTable 
        columns={getCategoryColumns(handleUpdateCategory, handleDeleteCategory)} 
        data={categories} 
        searchKey="name" 
      />
    </div>
  );
}
