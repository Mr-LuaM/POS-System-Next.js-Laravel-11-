"use client";

import { useSuppliers } from "@/hooks/useSuppliers";
import { useState } from "react";
import { DataTable } from "@/components/common/data-table";
import { getSupplierColumns } from "./columns";
import SupplierModal from "./supplier-modal";
import ConfirmDialog from "@/components/common/confirm-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

/**
 * ✅ Suppliers Table (Handles Full CRUD)
 */
export default function SuppliersTable() {
  const { suppliers, loading, handleAddSupplier, handleUpdateSupplier, handleDeleteSupplier } = useSuppliers();
  const [supplierData, setSupplierData] = useState<{ id?: number; name: string; contact: string; email?: string; address?: string } | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [deleteSupplierId, setDeleteSupplierId] = useState<number | null>(null);

  // ✅ Open Add Modal
  const openAddModal = () => {
    setSupplierData({ name: "", contact: "", email: "", address: "" });
    setModalOpen(true);
  };

  // ✅ Open Edit Modal
  const openEditModal = (supplier: any) => {
    setSupplierData(supplier);
    setModalOpen(true);
  };

  // ✅ Handle Submit
  const handleSubmitSupplier = async (data: any) => {
    try {
      if (supplierData?.id) {
        await handleUpdateSupplier(supplierData.id, data);
      } else {
        await handleAddSupplier(data);
      }
      toast.success("Supplier saved successfully!");
      setModalOpen(false);
    } catch {
      toast.error("Failed to save supplier.");
    }
  };

  return (
    <div className="w-full p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">Suppliers</h1>
        <Button onClick={openAddModal} className="px-4 py-2">+ Add Supplier</Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading suppliers...</p>
      ) : (
        <DataTable columns={getSupplierColumns(openEditModal, setDeleteSupplierId)} data={suppliers} searchKey="name" />
      )}

      <SupplierModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmitSupplier}
        supplierData={supplierData || undefined}
      />

      <ConfirmDialog
        open={!!deleteSupplierId}
        onConfirm={async () => {
          if (deleteSupplierId !== null) {
            await handleDeleteSupplier(deleteSupplierId);
            setDeleteSupplierId(null);
          }
        }}
        onCancel={() => setDeleteSupplierId(null)}
        title="Confirm Deletion"
        description="Are you sure you want to delete this supplier?"
      />
    </div>
  );
}
