import { axiosInstance, handleApiError } from "@/lib/apiService";
import { Customer } from "@/hooks/useCustomers";

/**
 * ✅ Fetch Customer by ID
 */
export const fetchCustomer = async (customerId: number): Promise<Customer> => {
  try {
    const response = await axiosInstance.get(`/customers/${customerId}`);
    return response.data.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * ✅ Search Customer by Barcode
 */
export const searchCustomerByBarcode = async (barcode: string): Promise<Customer | null> => {
  try {
    const response = await axiosInstance.get(`/customers/search`, { params: { barcode } });
    return response.data.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * ✅ Register a New Customer (Auto-generates Barcode & QR Code)
 */
export const registerCustomer = async (
  customerData: Omit<Customer, "id" | "barcode" | "qr_code">
): Promise<Customer> => {
  try {
    const response = await axiosInstance.post("/customers/add", customerData);
    return response.data.data; // ✅ Ensure response includes barcode & qr_code
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * ✅ Update Customer Details
 */
export const updateCustomer = async (
  customerId: number,
  customerData: Partial<Omit<Customer, "barcode" | "qr_code">>
): Promise<Customer> => {
  try {
    const response = await axiosInstance.put(`/customers/update/${customerId}`, customerData);
    return response.data.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * ✅ Soft Delete Customer (Archiving)
 */
export const deleteCustomer = async (customerId: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/customers/delete/${customerId}`);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * ✅ Restore an Archived Customer
 */
export const restoreCustomer = async (customerId: number): Promise<void> => {
  try {
    await axiosInstance.put(`/customers/restore/${customerId}`);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * ❌ Permanently Delete Customer (Cannot Be Restored)
 */
export const forceDeleteCustomer = async (customerId: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/customers/force-delete/${customerId}`);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * ✅ Fetch All Customers (With Optional Archived Filter)
 */
export const fetchAllCustomers = async (includeArchived = false): Promise<Customer[]> => {
  try {
    const params = includeArchived ? { archived: true } : {};
    const response = await axiosInstance.get(`/customers`, { params });
    return response.data.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};
