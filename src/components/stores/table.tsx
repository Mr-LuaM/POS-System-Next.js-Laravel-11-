"use client";

import { useStores } from "@/hooks/useStores";
import { useState, useEffect } from "react";
import { DataTable } from "@/components/common/data-table";
import { getStoreColumns } from "./columns";
import StoreModal from "./store-modal";
import ConfirmDialog from "@/components/common/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"; // ✅ Toggle Active/Archived

/**
 * ✅ Stores Table (Handles Full CRUD & Archive)
 */
export default function StoresTable() {
  const {
    stores,
    loading,
    saveStore,
    handleArchiveStore,
    handleRestoreStore,
    handleDeleteStore,
    archivedFilter,
    setArchivedFilter,
  } = useStores();

  const [storeData, setStoreData] = useState<{ id?: number; name: string; location?: string } | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{ id: number; type: "archive" | "restore" | "delete" } | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false); // ✅ Loading state for confirm actions

  // ✅ Debugging ConfirmDialog State
  useEffect(() => {
    console.log("ConfirmDialog state updated:", confirmDialog);
  }, [confirmDialog]);

  /**
   * ✅ Open Add Store Modal
   */
  const openAddModal = () => {
    setStoreData(null);
    setModalOpen(true);
  };

  /**
   * ✅ Open Edit Store Modal
   */
  const openEditModal = (store: any) => {
    setStoreData(store);
    setModalOpen(true);
  };

  /**
   * ✅ Open Confirm Dialog
   */
  const openConfirmDialog = (id: number, type: "archive" | "restore" | "delete") => {
    console.log(`Opening confirm dialog for: ${type} (ID: ${id})`);
    setConfirmDialog({ id, type });
  };

  /**
   * ✅ Handle Add or Update Store Submission
   */
  const handleSubmitStore = async (data: { name: string; location?: string }) => {
    const success = await saveStore(data, storeData?.id);
    if (success) {
      setModalOpen(false);
    }
  };

  /**
   * ✅ Handle Archive, Restore, or Delete Confirmation with Loading
   */
  const handleConfirmAction = async () => {
    if (!confirmDialog) return;

    setConfirmLoading(true); // ✅ Start loading
    try {
      if (confirmDialog.type === "archive") {
        await handleArchiveStore(confirmDialog.id);
      } else if (confirmDialog.type === "restore") {
        await handleRestoreStore(confirmDialog.id);
      } else if (confirmDialog.type === "delete") {
        await handleDeleteStore(confirmDialog.id);
      }
    } catch (error) {
      console.error("Error processing action:", error);
    } finally {
      setConfirmDialog(null);
      setConfirmLoading(false); // ✅ Stop loading after completion
    }
  };

  return (
    <div className="w-full p-6 space-y-6">
      {/* ✅ Page Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">Stores</h1>
        <Button onClick={openAddModal} className="px-4 py-2">+ Add Store</Button>
      </div>

      {/* ✅ Toggle Active/Archived Stores */}
      <div className="flex justify-end">
        <ToggleGroup
          type="single"
          value={archivedFilter === "true" ? "archived" : archivedFilter === "false" ? "active" : "all"}
          onValueChange={(value) => setArchivedFilter(value === "archived" ? "true" : value === "active" ? "false" : null)}
          className="mb-4"
        >
          <ToggleGroupItem value="all">All Stores</ToggleGroupItem>
          <ToggleGroupItem value="active">Active Stores</ToggleGroupItem>
          <ToggleGroupItem value="archived">Archived Stores</ToggleGroupItem>
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
            columns={getStoreColumns(openEditModal, openConfirmDialog)}
            data={stores}
            searchKey="name"
          />
        </div>
      )}

      {/* ✅ Store Modal */}
      <StoreModal 
        isOpen={isModalOpen} 
        onClose={() => setModalOpen(false)} 
        onSubmit={handleSubmitStore} 
        storeData={storeData || undefined} 
      />

      {/* ✅ Confirm Dialog with Loading */}
      {confirmDialog && (
        <ConfirmDialog
          key={confirmDialog.id}
          open={true}
          onConfirm={handleConfirmAction} // ✅ Uses function with loading
          onCancel={() => setConfirmDialog(null)}
          title={
            confirmDialog.type === "archive"
              ? "Archive Store"
              : confirmDialog.type === "restore"
              ? "Restore Store"
              : "Delete Store"
          }
          description={
            confirmDialog.type === "archive"
              ? "Are you sure you want to archive this store? You can restore it later."
              : confirmDialog.type === "restore"
              ? "Are you sure you want to restore this store?"
              : "Are you sure you want to permanently delete this store? This action cannot be undone."
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
          loading={confirmLoading} // ✅ Pass loading state to ConfirmDialog
        />
      )}
    </div>
  );
}
