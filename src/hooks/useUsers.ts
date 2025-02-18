"use client";

import { useState, useEffect, useCallback } from "react";
import { getUsers, addUser, updateUser, deleteUser } from "@/services/users";
import { toast } from "sonner";

/**
 * ✅ User Type Definition
 */
interface User {
  id?: number;
  name: string;
  email: string;
  role: "admin" | "cashier" | "manager";
  password?: string;
}

/**
 * ✅ Custom Hook for Managing Users
 */
export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch Users
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      setUsers(data || []);
    } catch (error: any) {
      toast.error(`Fetching failed: ${error.message || "Failed to fetch users."}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);
  
  const saveUser = async (userData: Partial<User>, id?: number) => {
    try {
      if (id) {
        if (!userData.password) delete userData.password; // ✅ Exclude password if empty
        await updateUser(id, userData);
        toast.success("User updated successfully.");
      } else {
        await addUser(userData);
        toast.success("User added successfully.");
      }
      fetchUsers();
    } catch (error: any) {
      // ✅ Extract validation errors (422)
      if (error.response?.status === 422) {
        const validationErrors = error.response.data.errors;
        Object.entries(validationErrors).forEach(([field, messages]) => {
          (messages as string[]).forEach((message) => toast.error(`${message}`));
        });
      } else {
        toast.error(`Saving failed: ${error.message || "An error occurred."}`);
      }
    }
  };
  
  // ✅ Delete User
  const handleDeleteUser = async (id: number) => {
    try {
      await deleteUser(id);
      toast.success("User deleted successfully.");
      fetchUsers();
    } catch (error: any) {
      toast.error(`Deletion failed: ${error.message || "Failed to delete user."}`);
    }
  };

  return { users, loading, saveUser, handleDeleteUser, refreshUsers: fetchUsers };
};
