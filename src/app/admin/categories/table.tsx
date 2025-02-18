"use client";

import { useCategories } from "@/hooks/useCategories";
import { useState } from "react";
import { DataTable } from "@/components/common/data-table";
import { getCategoryColumns } from "./columns"; // ✅ Uses renamed function
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

/**
 * ✅ CategoriesTable Component with Full CRUD Functionality
 */
export default function CategoriesTable() {
  const { categories, loading, handleAddCategory, handleUpdateCategory, handleDeleteCategory } = useCategories();
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState<{ id: number; name: string } | null>(null);
  const [error, setError] = useState("");
  const [isDialogOpen, setDialogOpen] = useState(false);

  // ✅ Add Category
  const handleSubmit = async () => {
    if (newCategory.trim() === "") {
      setError("Category name cannot be empty.");
      return;
    }

    try {
      await handleAddCategory(newCategory);
      setNewCategory("");
      toast.success("Category added successfully");
      setError("");
    } catch {
      toast.error("Failed to add category.");
    }
  };

  // ✅ Open Edit Modal
  const handleEdit = (category: { id: number; name: string }) => {
    setEditingCategory(category);
    setDialogOpen(true);
  };

  // ✅ Save Edited Category
  const handleSaveEdit = async () => {
    if (!editingCategory || editingCategory.name.trim() === "") {
      setError("Category name cannot be empty.");
      return;
    }

    try {
      await handleUpdateCategory(editingCategory.id, editingCategory.name);
      toast.success("Category updated successfully");
      setDialogOpen(false);
      setEditingCategory(null);
      setError("");
    } catch {
      toast.error("Failed to update category.");
    }
  };

  // ✅ Delete Category
  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this category?")) {
      try {
        await handleDeleteCategory(id);
        toast.success("Category deleted successfully");
      } catch {
        toast.error("Failed to delete category.");
      }
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Categories</h1>

      {/* ✅ Add Category Form */}
      <div className="flex gap-2 items-center">
        <Input
          placeholder="Enter new category"
          value={newCategory}
          onChange={(e) => {
            setError("");
            setNewCategory(e.target.value);
          }}
          className="bg-muted border border-border text-foreground"
        />
        <Button onClick={handleSubmit} className="px-4 py-2">
          Add
        </Button>
      </div>
      {error && <p className="text-destructive">{error}</p>}

      {/* ✅ Categories Table */}
      {loading ? (
        <p className="text-muted-foreground">Loading categories...</p>
      ) : (
        <DataTable columns={getCategoryColumns(handleEdit, handleDelete)} data={categories} searchKey="name" />
      )}

      {/* ✅ Edit Category Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Category Name"
            value={editingCategory?.name ?? ""}
            onChange={(e) => setEditingCategory((prev) => (prev ? { ...prev, name: e.target.value } : null))}
            className="bg-muted border border-border text-foreground"
          />
          {error && <p className="text-destructive">{error}</p>}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
