"use client";

import { useUsers } from "@/hooks/useUsers";
import { useState, useEffect } from "react";
import { DataTable } from "@/components/common/data-table";
import { getUserColumns } from "./columns";
import UserModal from "./user-modal";
import ConfirmDialog from "@/components/common/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

/**
 * ✅ Users Table (Handles Full CRUD & Archive)
 */
export default function UsersTable() {
  const {
    users,
    loading,
    saveUser,
    handleArchiveUser,
    handleRestoreUser,
    handleDeleteUser,
    archivedFilter,
    setArchivedFilter,
  } = useUsers();

  const [userData, setUserData] = useState<{ id?: number; name: string; email: string; role: string } | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{ id: number; type: "archive" | "restore" | "delete" } | null>(null);

  /**
   * ✅ Open Add User Modal
   */
  const openAddModal = () => {
    setUserData(null);
    setModalOpen(true);
  };

  /**
   * ✅ Open Edit User Modal (Ensure Data is Passed)
   */
  const openEditModal = (user: { id: number; name: string; email: string; role: string }) => {
    console.log("Editing user:", user); // ✅ Debugging
    setUserData(user);
    setModalOpen(true);
  };

  /**
   * ✅ Open Confirm Dialog
   */
  const openConfirmDialog = (id: number, type: "archive" | "restore" | "delete") => {
    setConfirmDialog({ id, type });
  };

  /**
   * ✅ Handle Add or Update User Submission
   */
  /**
 * ✅ Handle Add or Update User Submission
 */
const handleSubmitUser = async (data: Partial<User>) => {
  console.log("Submitting user data:", data); // ✅ Debugging

  const success = await saveUser(data, userData?.id); // ✅ Check if update request is happening

  if (success) {
    console.log("User saved successfully. Closing modal.");
    setModalOpen(false);
  } else {
    console.log("User save failed. Keeping modal open.");
  }
};


  /**
   * ✅ Handle Archive, Restore, or Delete Confirmation
   */
  const handleConfirmAction = async () => {
    if (!confirmDialog) return;

    try {
      if (confirmDialog.type === "archive") {
        await handleArchiveUser(confirmDialog.id);
      } else if (confirmDialog.type === "restore") {
        await handleRestoreUser(confirmDialog.id);
      } else if (confirmDialog.type === "delete") {
        await handleDeleteUser(confirmDialog.id);
      }
    } catch (error) {
      console.error("Error processing action:", error);
    } finally {
      setConfirmDialog(null);
    }
  };

  return (
    <div className="w-full p-6 space-y-6">
      {/* ✅ Page Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">Users</h1>
        <Button onClick={openAddModal} className="px-4 py-2">+ Add User</Button>
      </div>

      {/* ✅ Toggle Active/Archived Users */}
      <div className="flex justify-end">
        <ToggleGroup
          type="single"
          value={archivedFilter === "true" ? "archived" : archivedFilter === "false" ? "active" : "all"}
          onValueChange={(value) => setArchivedFilter(value === "archived" ? "true" : value === "active" ? "false" : null)}
          className="mb-4"
        >
          <ToggleGroupItem value="all">All Users</ToggleGroupItem>
          <ToggleGroupItem value="active">Active Users</ToggleGroupItem>
          <ToggleGroupItem value="archived">Archived Users</ToggleGroupItem>
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
        <DataTable columns={getUserColumns(openEditModal, openConfirmDialog)} data={users} searchKey="name" />
      )}

      {/* ✅ User Modal */}
      <UserModal 
        isOpen={isModalOpen} 
        onClose={() => setModalOpen(false)} 
        onSubmit={handleSubmitUser} 
        userData={userData || undefined} 
      />

      {/* ✅ Confirm Dialog */}
      {confirmDialog && (
        <ConfirmDialog
          key={confirmDialog.id}
          open={true}
          onConfirm={handleConfirmAction}
          onCancel={() => setConfirmDialog(null)}
          title={
            confirmDialog.type === "archive"
              ? "Archive User"
              : confirmDialog.type === "restore"
              ? "Restore User"
              : "Delete User"
          }
          description={
            confirmDialog.type === "archive"
              ? "Are you sure you want to archive this user? You can restore it later."
              : confirmDialog.type === "restore"
              ? "Are you sure you want to restore this user?"
              : "Are you sure you want to permanently delete this user? This action cannot be undone."
          }
        />
      )}
    </div>
  );
}
