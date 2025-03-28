"use client";

import { useSuppliers } from "@/hooks/useSuppliers";
import { useState } from "react";
import { DataTable } from "@/components/common/data-table";
import { getSupplierColumns } from "./columns";
import SupplierModal from "./supplier-modal";
import ConfirmDialog from "@/components/common/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"; // ✅ Active/Archived toggle

/**
 * ✅ Suppliers Table (Handles Full CRUD & Archive)
 */
export default function SuppliersTable() {
  const {
    suppliers,
    loading,
    saveSupplier,
    handleArchiveSupplier,
    handleRestoreSupplier,
    handleDeleteSupplier,
    archivedFilter,
    setArchivedFilter,
    refreshSuppliers, // ✅ Ensure suppliers refresh after actions
  } = useSuppliers();

  const [supplierData, setSupplierData] = useState<{ id?: number; name: string; contact?: string; email?: string; address?: string } | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{ id: number; type: "archive" | "restore" | "delete" } | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  /**
   * ✅ Open Add Supplier Modal
   */
  const openAddModal = () => {
    setSupplierData({ name: "", contact: "", email: "", address: "" });
    setModalOpen(true);
  };

  /**
   * ✅ Open Edit Supplier Modal
   */
  const openEditModal = (supplier: any) => {
    setSupplierData(supplier);
    setModalOpen(true);
  };

  /**
   * ✅ Open Confirm Dialog
   */
  const openConfirmDialog = (id: number, type: "archive" | "restore" | "delete") => {
    setConfirmDialog({ id, type });
  };

  /**
   * ✅ Handle Add or Update Supplier
   */
  const handleSubmitSupplier = async (data: Partial<Supplier>) => {
    const success = await saveSupplier(data, supplierData?.id);
    if (success) {
      setModalOpen(false);
      refreshSuppliers(); // ✅ Refresh suppliers list
    }
  };

  /**
   * ✅ Handle Confirm Action (Archive, Restore, Delete)
   */
  const handleConfirmAction = async () => {
    if (!confirmDialog) return;

    setConfirmLoading(true);
    try {
      if (confirmDialog.type === "archive") {
        await handleArchiveSupplier(confirmDialog.id);
      } else if (confirmDialog.type === "restore") {
        await handleRestoreSupplier(confirmDialog.id);
      } else if (confirmDialog.type === "delete") {
        await handleDeleteSupplier(confirmDialog.id);
      }
      refreshSuppliers(); // ✅ Always refresh after action
    } catch (error) {
      console.error("Error processing action:", error);
    } finally {
      setConfirmDialog(null);
      setConfirmLoading(false);
    }
  };

  return (
    <div className="w-full p-6 space-y-6">
      {/* ✅ Page Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">Suppliers</h1>
        <Button onClick={openAddModal} className="px-4 py-2">+ Add Supplier</Button>
      </div>

      {/* ✅ Toggle Active/Archived Suppliers */}
      <div className="flex justify-end">
        <ToggleGroup
          type="single"
          value={archivedFilter === "true" ? "archived" : archivedFilter === "false" ? "active" : "all"}
          onValueChange={(value) => setArchivedFilter(value === "archived" ? "true" : value === "active" ? "false" : null)}
          className="mb-4"
        >
          <ToggleGroupItem value="all">All Suppliers</ToggleGroupItem>
          <ToggleGroupItem value="active">Active Suppliers</ToggleGroupItem>
          <ToggleGroupItem value="archived">Archived Suppliers</ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* ✅ DataTable with Loading Skeleton */}
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : (
        <div className="w-full max-w-none px-0">
          <DataTable
            columns={getSupplierColumns(openEditModal, openConfirmDialog)}
            data={suppliers}
            searchKeys={["name", "contact", "email", "address"]} // ✅ Supports multiple search fields
          />
        </div>
      )}

      {/* ✅ Supplier Modal */}
      {isModalOpen && (
        <SupplierModal 
          isOpen={isModalOpen} 
          onClose={() => setModalOpen(false)} 
          onSubmit={handleSubmitSupplier} 
          supplierData={supplierData || undefined} 
        />
      )}

      {/* ✅ Confirm Dialog */}
      {confirmDialog && (
        <ConfirmDialog
          key={confirmDialog.id}
          open={true}
          onConfirm={handleConfirmAction}
          onCancel={() => setConfirmDialog(null)}
          title={
            confirmDialog.type === "archive"
              ? "Archive Supplier"
              : confirmDialog.type === "restore"
              ? "Restore Supplier"
              : "Delete Supplier"
          }
          description={
            confirmDialog.type === "archive"
              ? "Are you sure you want to archive this supplier? You can restore it later."
              : confirmDialog.type === "restore"
              ? "Are you sure you want to restore this supplier?"
              : "Are you sure you want to permanently delete this supplier? This action cannot be undone."
          }
          confirmLabel={
            confirmDialog.type === "archive"
              ? "Archive"
              : confirmDialog.type === "restore"
              ? "Restore"
              : "Delete"
          }
          cancelLabel="Cancel"
          confirmVariant={
            confirmDialog.type === "archive"
              ? "outline"
              : confirmDialog.type === "restore"
              ? "secondary"
              : "destructive"
          }
          loading={confirmLoading}
        />
      )}
    </div>
  );
}
