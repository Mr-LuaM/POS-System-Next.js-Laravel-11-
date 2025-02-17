"use client";

import { categoryColumns } from "./columns";
import { useCategories } from "@/hooks/useCategories";
import { DataTable } from "@/components/common/data-table"; // ✅ FIXED IMPORT

export default function CategoryTable() {
  const { categories, loading } = useCategories();

  return <DataTable columns={categoryColumns} data={categories} />;
}
