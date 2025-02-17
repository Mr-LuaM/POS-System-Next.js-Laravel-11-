"use client";

import { useCategories } from "@/hooks/useCategories";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CategoryTable from "./data-table";

export default function CategoriesPage() {
  const { handleAddCategory } = useCategories();
  const [newCategory, setNewCategory] = useState("");

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Categories</h1>

      {/* Add Category Form */}
      <div className="flex gap-2 mb-6">
        <Input
          placeholder="Enter new category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <Button onClick={() => { handleAddCategory(newCategory); setNewCategory(""); }}>
          Add
        </Button>
      </div>

      {/* Categories Table */}
      <CategoryTable />
    </div>
  );
}
