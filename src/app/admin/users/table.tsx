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
   * ✅ Open Edit User Modal
   */
  const openEditModal = (user: any) => {
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
  const handleSubmitUser = async (data: Partial<User>) => {
    const success = await saveUser(data, userData?.id);
    if (success) {
      setModalOpen(false);
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
        <div className="w-full max-w-none px-0">
          <DataTable
            columns={getUserColumns(openEditModal, openConfirmDialog)}
            data={users}
            searchKey="name"
          />
        </div>
      )}

      {/* ✅ User Modal */}
      <UserModal 
        isOpen={isModalOpen} 
        onClose={() => setModalOpen(false)} 
        onSubmit={handleSubmitUser} 
        userData={userData || undefined} 
      />

      {/* ✅ Confirm Dialog with Loading State */}
      {confirmDialog && (
        <ConfirmDialog
          key={confirmDialog.id}
          open={true}
          onConfirm={async () => {
            if (confirmDialog.type === "archive") {
              await handleArchiveUser(confirmDialog.id);
            } else if (confirmDialog.type === "restore") {
              await handleRestoreUser(confirmDialog.id);
            } else if (confirmDialog.type === "delete") {
              await handleDeleteUser(confirmDialog.id);
            }
            setConfirmDialog(null);
          }}
          onCancel={() => setConfirmDialog(null)}
          title={
            confirmDialog.type === "archive"
              ? "Archive User"
              : confirmDialog.type === "restore"
              ? "Restore User"
              : "Delete User"
          }
          description="This action cannot be undone."
        />
      )}
    </div>
  );
}
