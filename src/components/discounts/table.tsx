"use client";

import { useDiscounts } from "@/hooks/useDiscounts";
import { useState } from "react";
import { DataTable } from "@/components/common/data-table";
import { getDiscountColumns } from "./columns";
import DiscountModal from "./discount-modal";
import ConfirmDialog from "@/components/common/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function DiscountsTable() {
  const {
    discounts,
    loading,
    handleAddDiscount,
    handleUpdateDiscount,
    handleDeleteDiscount,
    refreshDiscounts,
  } = useDiscounts();

  const [discountData, setDiscountData] = useState<{
    id?: number;
    code: string;
    discount_value: number;
    discount_type: "fixed" | "percentage";
    applies_to: "all" | "category" | "product" | "min_purchase";
    valid_until: string;
    category_id?: string;
    product_id?: string;
    min_purchase_amount?: number | null;
  } | null>(null);

  const [isModalOpen, setModalOpen] = useState(false);
  const [deleteDiscountId, setDeleteDiscountId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  /**
   * ✅ Open Add Discount Modal
   */
  const openAddModal = () => {
    setDiscountData({
      code: "",
      discount_value: 0,
      discount_type: "fixed",
      applies_to: "all",
      valid_until: "",
      category_id: "",
      product_id: "",
      min_purchase_amount: null,
    });
    setModalOpen(true);
  };

  /**
   * ✅ Open Edit Discount Modal
   */
  const openEditModal = (discount: typeof discountData) => {
    setDiscountData({ ...discount, id: discount.id }); // ✅ Ensure ID is included
    setModalOpen(true);
  };
  

  /**
   * ✅ Handle Add or Update Discount
   */
  const handleSubmitDiscount = async (data: any) => {
    if (!data?.code.trim() || data.discount_value <= 0) return;
  
    if (data.id) {
      await handleUpdateDiscount(data.id, data);  // ✅ Update Discount
    } else {
      await handleAddDiscount(data);  // ✅ Add Discount
    }
  
    setModalOpen(false);
    refreshDiscounts();
  };
  

  /**
   * ✅ Handle Delete Discount with Loading
   */
  const handleConfirmDelete = async () => {
    if (deleteDiscountId === null) return;
    setDeleteLoading(true);
    await handleDeleteDiscount(deleteDiscountId);
    setDeleteDiscountId(null);
    setDeleteLoading(false);
    refreshDiscounts();
  };

  return (
    <div className="w-full p-6 space-y-6">
      {/* ✅ Page Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">Discounts</h1>
        <Button onClick={openAddModal} className="px-4 py-2">+ Add Discount</Button>
      </div>

      {/* ✅ Discounts Table with Loading Skeleton */}
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : (
        <div className="w-full max-w-none px-0">
          <DataTable
            columns={getDiscountColumns(openEditModal, setDeleteDiscountId)}
            data={discounts.map((discount) => ({
              ...discount,
              category_name: discount.category_id ? "Category Name" : "N/A",
              product_name: discount.product_id ? "Product Name" : "N/A",
            }))}
            searchKeys={["code", "category_name", "product_name"]} // ✅ Supports searching by multiple fields
          />
        </div>
      )}

      {/* ✅ Discount Modal */}
      {isModalOpen && (
        <DiscountModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmitDiscount}
          discountData={discountData}
          setDiscountData={setDiscountData}
          isEdit={!!discountData?.id}
        />
      )}

      {/* ✅ Delete Confirmation Modal */}
      {deleteDiscountId && (
        <ConfirmDialog
          open={!!deleteDiscountId}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteDiscountId(null)}
          title="Confirm Deletion"
          description="Are you sure you want to delete this discount?"
          confirmLabel="Delete"
          cancelLabel="Cancel"
          confirmVariant="destructive"
          loading={deleteLoading}
        />
      )}
    </div>
  );
}
