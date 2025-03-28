"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getUsers,
  addUser,
  updateUser,
  archiveUser,
  restoreUser,
  deleteUser,
  updateUserRole,
  User,
} from "@/services/users";
import { toast } from "sonner";

/**
 * ✅ Custom Hook for Managing Users (Supports Active & Archived Users)
 */
export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [archivedFilter, setArchivedFilter] = useState<string | null>(null); // ✅ NULL = fetch all users

  /**
   * ✅ Fetch Users from API (Supports Active, Archived & All Users)
   */
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setIsError(false);
    try {
      const data = await getUsers(archivedFilter); // ✅ Pass filter dynamically
      setUsers(data);
    } catch (error: any) {
      toast.error(`Error: ${error.message || "Failed to fetch users."}`);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  }, [archivedFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  /**
   * ✅ Add or Update User (With Validation & Auto-Refresh)
   */
  const saveUser = async (userData: Partial<User> & { password?: string }, id?: number): Promise<boolean> => {
    try {
      if (id) {
        console.log("Updating user with ID:", id, userData); // ✅ Debugging
  
        // ✅ Ensure empty password is not sent
        if (!userData.password) delete userData.password;
  
        await updateUser(id, userData);
        toast.success("Success: User updated successfully.");
      } else {
        console.log("Creating new user:", userData); // ✅ Debugging
  
        await addUser(userData as User & { password: string });
        toast.success("Success: User added successfully.");
      }
  
      fetchUsers(); // ✅ Refresh user list after success
      return true;
    } catch (error: any) {
      toast.error(`Error: ${error.message || "Failed to save user."}`);
      return false;
    }
  };
  

  /**
   * ✅ Archive (Soft Delete) User
   */
  const handleArchiveUser = async (id: number) => {
    try {
      await archiveUser(id);
      toast.success("Success: User archived successfully.");
      fetchUsers();
    } catch (error: any) {
      toast.error(`Error: ${error.message || "Failed to archive user."}`);
    }
  };

  /**
   * ✅ Restore User
   */
  const handleRestoreUser = async (id: number) => {
    try {
      await restoreUser(id);
      toast.success("Success: User restored successfully.");
      fetchUsers();
    } catch (error: any) {
      toast.error(`Error: ${error.message || "Failed to restore user."}`);
    }
  };

  /**
   * ✅ Permanently Delete User (Only if Archived)
   */
  const handleDeleteUser = async (id: number) => {
    try {
      await deleteUser(id);
      toast.success("Success: User permanently deleted.");
      fetchUsers();
    } catch (error: any) {
      toast.error(`Error: ${error.message || "Failed to delete user."}`);
    }
  };

  /**
   * ✅ Update User Role
   */
  const handleUpdateUserRole = async (id: number, role: "admin" | "cashier" | "manager") => {
    try {
      await updateUserRole(id, role);
      toast.success("Success: User role updated successfully.");
      fetchUsers();
    } catch (error: any) {
      toast.error(`Error: ${error.message || "Failed to update user role."}`);
    }
  };

  return {
    users,
    loading,
    isError,
    saveUser,
    handleArchiveUser,
    handleRestoreUser,
    handleDeleteUser,
    handleUpdateUserRole,
    refreshUsers: fetchUsers,
    archivedFilter, // ✅ Expose archived filter
    setArchivedFilter, // ✅ Expose filter setter
  };
};
