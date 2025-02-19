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
    const response = await axiosInstance.get("/users", { params });
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * ✅ Add a New User
 */
export const addUser = async (userData: Omit<User, "id" | "created_at" | "deleted_at"> & { password: string }): Promise<User> => {
  try {
    const response = await axiosInstance.post("/users/create", userData);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * ✅ Update a User
 */
export const updateUser = async (id: number, userData: Partial<Omit<User, "id" | "created_at" | "deleted_at"> & { password?: string }>): Promise<User> => {
  try {
    const response = await axiosInstance.put(`/users/update/${id}`, userData);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * ✅ Archive (Soft Delete) User
 */
export const archiveUser = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/users/archive/${id}`);
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * ✅ Restore Archived User
 */
export const restoreUser = async (id: number): Promise<User> => {
  try {
    const response = await axiosInstance.put(`/users/restore/${id}`);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * ✅ Permanently Delete a User (Only if Archived)
 */
export const deleteUser = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/users/delete/${id}`);
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * ✅ Update User Role
 */
export const updateUserRole = async (id: number, role: "admin" | "cashier" | "manager"): Promise<User> => {
  try {
    const response = await axiosInstance.put(`/users/update-role/${id}`, { role });
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
