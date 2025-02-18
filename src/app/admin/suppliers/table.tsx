"use client";

import { useSuppliers } from "@/hooks/useSuppliers";
import { useState } from "react";
import { DataTable } from "@/components/common/data-table";
import { getSupplierColumns } from "./columns";
import SupplierModal from "./supplier-modal";
import ConfirmDialog from "@/components/common/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Supplier } from "./columns";

/**
 * ✅ Suppliers Table (Handles Full CRUD)
 */
export default function SuppliersTable() {
  const { suppliers, loading, saveSupplier, handleDeleteSupplier } = useSuppliers();
  const [supplierData, setSupplierData] = useState<Supplier | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [deleteSupplierId, setDeleteSupplierId] = useState<number | null>(null);

  /**
   * ✅ Open Add Supplier Modal
   */
  const openAddModal = () => {
    setSupplierData(null);
    setModalOpen(true);
  };

  /**
   * ✅ Open Edit Supplier Modal
   */
  const openEditModal = (supplier: Supplier) => {
    setSupplierData(supplier);
    setModalOpen(true);
  };

  /**
   * ✅ Handle Add or Update Supplier Submission
   */
  const handleSubmitSupplier = async (data: Supplier) => {
    await saveSupplier(data, supplierData?.id);
    setModalOpen(false); // ✅ Close modal only on success
  };

  /**
   * ✅ Handle Delete Confirmation
   */
  const handleDelete = async () => {
    if (deleteSupplierId === null) return;
    await handleDeleteSupplier(deleteSupplierId);
    setDeleteSupplierId(null);
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

      <SupplierModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} onSubmit={handleSubmitSupplier} supplierData={supplierData || undefined} />

      <ConfirmDialog open={!!deleteSupplierId} onConfirm={handleDelete} onCancel={() => setDeleteSupplierId(null)} title="Confirm Deletion" description="Are you sure you want to delete this supplier?" />
    </div>
  );
}
