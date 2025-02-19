"use client";

import { useCategories } from "@/hooks/useCategories";
import { useState } from "react";
import { DataTable } from "@/components/common/data-table";
import { getCategoryColumns } from "./columns";
import CategoryModal from "./category-modal";
import ConfirmDialog from "@/components/common/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton"; // ✅ Added for loading state

/**
 * ✅ Categories Table (Handles Full CRUD Operations Including Add)
 */
export default function CategoriesTable() {
  const { categories, loading, handleAddCategory, handleUpdateCategory, handleDeleteCategory } = useCategories();
  const [categoryName, setCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState<{ id: number; name: string } | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false); // ✅ Added loading state for delete action

  // ✅ Open Add Modal
  const openAddModal = () => {
    setCategoryName("");
    setEditingCategory(null);
    setModalOpen(true);
  };

  // ✅ Open Edit Modal
  const openEditModal = (category: { id: number; name: string }) => {
    setEditingCategory(category);
    setCategoryName(category.name);
    setModalOpen(true);
  };

  // ✅ Handle Add or Update Category
  const handleSubmitCategory = async () => {
    if (!categoryName.trim()) return;

    if (editingCategory) {
      await handleUpdateCategory(editingCategory.id, categoryName);
      setEditingCategory(null);
    } else {
      await handleAddCategory(categoryName);
    }
    setModalOpen(false);
  };

  // ✅ Handle Delete Category with Loading
  const handleConfirmDelete = async () => {
    if (deleteCategoryId === null) return;
    setDeleteLoading(true); // ✅ Start loading
    await handleDeleteCategory(deleteCategoryId);
    setDeleteCategoryId(null);
    setDeleteLoading(false); // ✅ Stop loading after completion
  };

  return (
    <div className="w-full p-6 space-y-6">
      {/* ✅ Header with Add Button */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">Categories</h1>
        <Button onClick={openAddModal} className="px-4 py-2">+ Add Category</Button>
      </div>

      {/* ✅ Categories Table with Loading Skeleton */}
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : (
        <div className="w-full max-w-none px-0">
          <DataTable columns={getCategoryColumns(openEditModal, setDeleteCategoryId)} data={categories} searchKey="name" />
        </div>
      )}

      {/* ✅ Add/Edit Modal */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmitCategory}
        categoryName={categoryName}
        setCategoryName={setCategoryName}
        isEdit={!!editingCategory}
      />

      {/* ✅ Delete Confirmation Modal with Loading */}
      <ConfirmDialog
        open={!!deleteCategoryId}
        onConfirm={handleConfirmDelete} // ✅ Uses function with loading
        onCancel={() => setDeleteCategoryId(null)}
        title="Confirm Deletion"
        description="Are you sure you want to delete this category?"
        confirmLabel="Delete"
        cancelLabel="Cancel"
        confirmVariant="destructive"
        loading={deleteLoading} // ✅ Pass loading state to ConfirmDialog
      />
    </div>
  );
}
