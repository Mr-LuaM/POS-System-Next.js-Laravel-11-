import { axiosInstance, handleApiError } from "@/lib/apiService";
export interface Supplier {
    id: number;
    name: string;
    contact?: string;
    email?: string;
    address?: string;
    deleted_at?: string | null; // ✅ To check if supplier is archived
  }
  
/**
 * ✅ Fetch All Suppliers
 */
export const getSuppliers = async (includeArchived = false): Promise<Supplier[]> => {
    try {
    const response = await axiosInstance.get(`/suppliers?archived=${includeArchived}`);
    return response.data.data;
  } catch (error) {
    throw new Error(handleApiError(error)); // ✅ Return error message
  }
};

/**
 * ✅ Add a New Supplier
 */
export const addSupplier = async (supplierData: Omit<Supplier, "id">): Promise<Supplier> => {
  try {
    const response = await axiosInstance.post("/suppliers/add", supplierData);
    return response.data.data;
  } catch (error) {
    throw new Error(handleApiError(error)); // ✅ Return error message
  }
};

/**
 * ✅ Update a Supplier
 */
export const updateSupplier = async (supplierId: number, supplierData: Partial<Supplier>): Promise<Supplier> => {
  try {
    const response = await axiosInstance.put(`/suppliers/update/${supplierId}`, supplierData);
    return response.data.data;
  } catch (error) {
    throw new Error(handleApiError(error)); // ✅ Return error message
  }
};

/**
 * ✅ Archive a Supplier (Soft Delete)
 */
export const archiveSupplier = async (supplierId: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/suppliers/archive/${supplierId}`);
  } catch (error) {
    throw new Error(handleApiError(error)); // ✅ Return error message
  }
};

/**
 * ✅ Restore a Supplier (Undo Soft Delete)
 */
export const restoreSupplier = async (supplierId: number): Promise<void> => {
  try {
    await axiosInstance.put(`/suppliers/restore/${supplierId}`);
  } catch (error) {
    throw new Error(handleApiError(error)); // ✅ Return error message
  }
};

/**
 * ✅ Permanently Delete a Supplier
 */
export const deleteSupplier = async (supplierId: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/suppliers/delete/${supplierId}`);
  } catch (error) {
    throw new Error(handleApiError(error)); // ✅ Return error message
  }
};
