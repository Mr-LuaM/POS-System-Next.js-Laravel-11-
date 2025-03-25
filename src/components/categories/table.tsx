"use client";

import { useCategories } from "@/hooks/useCategories";
import { useState } from "react";
import { DataTable } from "@/components/common/data-table";
import { getCategoryColumns } from "./columns";
import CategoryModal from "./category-modal";
import ConfirmDialog from "@/components/common/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * ✅ Categories Table (Handles Full CRUD Operations)
 */
export default function CategoriesTable() {
  const {
    categories,
    loading,
    handleAddCategory,
    handleUpdateCategory,
    handleDeleteCategory,
    refreshCategories,
  } = useCategories();

  const [categoryData, setCategoryData] = useState<{ id?: number; name: string } | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  /**
   * ✅ Open Add Category Modal
   */
  const openAddModal = () => {
    setCategoryData({ name: "" });
    setModalOpen(true);
  };

  /**
   * ✅ Open Edit Category Modal
   */
  const openEditModal = (category: { id: number; name: string }) => {
    setCategoryData(category);
    setModalOpen(true);
  };

  /**
   * ✅ Handle Add or Update Category
   */
  const handleSubmitCategory = async () => {
    if (!categoryData?.name.trim()) return;

    if (categoryData.id) {
      await handleUpdateCategory(categoryData.id, categoryData.name);
    } else {
      await handleAddCategory(categoryData.name);
    }
    setModalOpen(false);
    refreshCategories(); // ✅ Ensure updated list is fetched
  };

  /**
   * ✅ Handle Delete Category with Loading
   */
  const handleConfirmDelete = async () => {
    if (deleteCategoryId === null) return;
    setDeleteLoading(true);
    await handleDeleteCategory(deleteCategoryId);
    setDeleteCategoryId(null);
    setDeleteLoading(false);
    refreshCategories(); // ✅ Refresh data after deletion
  };

  return (
    <div className="w-full p-6 space-y-6">
      {/* ✅ Page Header */}
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
          <DataTable
            columns={getCategoryColumns(openEditModal, setDeleteCategoryId)}
            data={categories}
            searchKeys={["name"]} // ✅ Ensures search is applied correctly
          />
        </div>
      )}

      {/* ✅ Category Modal */}
      {isModalOpen && (
        <CategoryModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmitCategory}
          categoryName={categoryData?.name || ""}
          setCategoryName={(name) => setCategoryData((prev) => ({ ...prev, name })!)}
          isEdit={!!categoryData?.id}
        />
      )}

      {/* ✅ Delete Confirmation Modal with Loading */}
      {deleteCategoryId && (
        <ConfirmDialog
          open={!!deleteCategoryId}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteCategoryId(null)}
          title="Confirm Deletion"
          description="Are you sure you want to delete this category?"
          confirmLabel="Delete"
          cancelLabel="Cancel"
          confirmVariant="destructive"
          loading={deleteLoading}
        />
      )}
    </div>
  );
}
