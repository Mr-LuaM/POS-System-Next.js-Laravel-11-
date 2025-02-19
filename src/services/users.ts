import { axiosInstance, handleApiError } from "@/lib/apiService";

/**
 * ✅ User Type Definition (Includes Soft Delete `deleted_at`)
 */
export interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "cashier" | "manager";
  created_at?: string;
  deleted_at?: string | null; // ✅ For soft-deleted users
}

/**
 * ✅ Fetch All Users (Supports Archived Query)
 */
export const getUsers = async (archived: string | null = null): Promise<User[]> => {
  try {
    const params = archived !== null ? { archived } : {}; // ✅ Only send if specified
    const { data } = await axiosInstance.get("/users", { params });
    return data.data;
  } catch (error) {
    throw new Error(handleApiError(error)); // ✅ Proper error handling
  }
};

/**
 * ✅ Add a New User
 */
export const addUser = async (userData: Omit<User, "id" | "created_at" | "deleted_at"> & { password: string }): Promise<User> => {
  try {
    const { data } = await axiosInstance.post("/users/create", userData);
    return data.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * ✅ Update a User
 */
export const updateUser = async (id: number, userData: Partial<Omit<User, "id" | "created_at" | "deleted_at"> & { password?: string }>): Promise<User> => {
  try {
    const { data } = await axiosInstance.put(`/users/update/${id}`, userData);
    return data.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * ✅ Archive (Soft Delete) User
 */
export const archiveUser = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/users/archive/${id}`);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * ✅ Restore Archived User
 */
export const restoreUser = async (id: number): Promise<User> => {
  try {
    const { data } = await axiosInstance.put(`/users/restore/${id}`);
    return data.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * ✅ Permanently Delete a User (Only if Archived)
 */
export const deleteUser = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/users/delete/${id}`);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * ✅ Update User Role
 */
export const updateUserRole = async (id: number, role: "admin" | "cashier" | "manager"): Promise<User> => {
  try {
    const { data } = await axiosInstance.put(`/users/update-role/${id}`, { role });
    return data.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};
