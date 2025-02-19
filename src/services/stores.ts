import { axiosInstance, handleApiError } from "@/lib/apiService";

/**
 * ✅ Store Type Definition (Includes Soft Delete `deleted_at`)
 */
export interface Store {
  id: number;
  name: string;
  location?: string;
  created_at?: string;
  deleted_at?: string | null; // ✅ For soft-deleted stores
}

/**
 * ✅ Fetch All Stores (Supports Active, Archived & All Stores)
 */
export const getStores = async (archived: "true" | "false" | "all" = "all"): Promise<Store[]> => {
  try {
    const response = await axiosInstance.get("/stores", {
      params: { archived }, // ✅ Pass query param for archived filter
    });
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * ✅ Add a New Store
 */
export const addStore = async (storeData: Omit<Store, "id" | "created_at" | "deleted_at">): Promise<Store> => {
  try {
    const response = await axiosInstance.post("/stores/create", storeData);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * ✅ Update a Store
 */
export const updateStore = async (storeId: number, storeData: Partial<Omit<Store, "created_at" | "deleted_at">>): Promise<Store> => {
  try {
    const response = await axiosInstance.put(`/stores/update/${storeId}`, storeData);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * ✅ Archive (Soft Delete) a Store
 */
export const archiveStore = async (storeId: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/stores/archive/${storeId}`);
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * ✅ Restore an Archived Store
 */
export const restoreStore = async (storeId: number): Promise<Store> => {
  try {
    const response = await axiosInstance.put(`/stores/restore/${storeId}`);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * ✅ Permanently Delete a Store (Only If Archived)
 */
export const deleteStore = async (storeId: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/stores/delete/${storeId}`);
  } catch (error) {
    throw handleApiError(error);
  }
};
