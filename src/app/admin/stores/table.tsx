"use client";

import { useStores } from "@/hooks/useStores";
import { useState } from "react";
import { DataTable } from "@/components/common/data-table";
import { getStoreColumns } from "./columns";
import StoreModal from "./store-modal";
import ConfirmDialog from "@/components/common/confirm-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

/**
 * ✅ Stores Table (Handles Full CRUD)
 */
export default function StoresTable() {
  const { stores, loading, handleAddStore, handleUpdateStore, handleDeleteStore } = useStores();
  const [storeData, setStoreData] = useState<{ id?: number; name: string; location?: string } | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [deleteStoreId, setDeleteStoreId] = useState<number | null>(null);

  // ✅ Open Add Modal
  const openAddModal = () => {
    setStoreData({ name: "", location: "" });
    setModalOpen(true);
  };

  // ✅ Open Edit Modal
  const openEditModal = (store: any) => {
    setStoreData(store);
    setModalOpen(true);
  };

 
  const handleSubmitStore = async (data: any) => {
    try {
      if (storeData?.id) {
        await handleUpdateStore(storeData.id, data);
        toast.success("Store updated successfully"); // ✅ Show only if no validation errors
      } else {
        await handleAddStore(data);
        toast.success("Store added successfully"); // ✅ Show only if no validation errors
      }
      setModalOpen(false);
    } catch (error: any) {
      if (error.response?.status === 422) {
        // ✅ Set validation errors in the form
        Object.entries(error.response.data.errors).forEach(([field, messages]) => {
          form.setError(field as any, { message: (messages as string[])[0] });
        });
      } else {
        toast.error("Failed to save store.");
      }
    }
  };
  

  return (
    <div className="w-full p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">Stores</h1>
        <Button onClick={openAddModal} className="px-4 py-2">+ Add Store</Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading stores...</p>
      ) : (
        <DataTable columns={getStoreColumns(openEditModal, setDeleteStoreId)} data={stores} searchKey="name" />
      )}

      <StoreModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmitStore}
        storeData={storeData || undefined}
      />

      <ConfirmDialog
        open={!!deleteStoreId}
        onConfirm={async () => {
          if (deleteStoreId !== null) {
            await handleDeleteStore(deleteStoreId);
            setDeleteStoreId(null);
          }
        }}
        onCancel={() => setDeleteStoreId(null)}
        title="Confirm Deletion"
        description="Are you sure you want to delete this store?"
      />
    </div>
  );
}
