"use client";

import { useUsers } from "@/hooks/useUsers";
import { useState } from "react";
import { DataTable } from "@/components/common/data-table";
import { getUserColumns } from "./columns";
import UserModal from "./user-modal";
import ConfirmDialog from "@/components/common/confirm-dialog";
import { Button } from "@/components/ui/button";


/**
 * ✅ Users Table (Handles Full CRUD)
 */
export default function UsersTable() {
  const { users, loading, saveUser, handleDeleteUser } = useUsers();
  const [userData, setUserData] = useState<{ id?: number; name: string; email: string; role: string } | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);

  // ✅ Open Add Modal
  const openAddModal = () => {
    setUserData(null);
    setModalOpen(true);
  };

  // ✅ Open Edit Modal
  const openEditModal = (user: any) => {
    setUserData(user);
    setModalOpen(true);
  };

  /**
   * ✅ Handle Add & Update User Submission
   */
  const handleSubmitUser = async (data: Partial<User>) => {
    try {
      if (userData?.id) {
        await saveUser(data, userData.id);
      } else {
        await saveUser(data);
      }
      setModalOpen(false); // ✅ Close modal only on success
    } catch {
      // ✅ Errors are already handled in the hook
    }
  };
  

  return (
    <div className="w-full p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">Users</h1>
        <Button onClick={openAddModal} className="px-4 py-2">+ Add User</Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading users...</p>
      ) : (
        <DataTable columns={getUserColumns(openEditModal, setDeleteUserId)} data={users} searchKey="name" />
      )}
<UserModal
  key={userData?.id || "new"} // 🔥 Ensures fresh modal state per user
  isOpen={isModalOpen}
  onClose={() => setModalOpen(false)}
  onSubmit={handleSubmitUser}
  userData={userData || undefined}
/>



      <ConfirmDialog
        open={!!deleteUserId}
        onConfirm={async () => {
          if (deleteUserId !== null) {
            await handleDeleteUser(deleteUserId);
            setDeleteUserId(null);
          }
        }}
        onCancel={() => setDeleteUserId(null)}
        title="Confirm Deletion"
        description="Are you sure you want to delete this user?"
      />
    </div>
  );
}
