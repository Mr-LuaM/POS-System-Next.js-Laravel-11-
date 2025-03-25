import { axiosInstance, handleApiError } from "@/lib/apiService";

/**
 * ✅ Fetch all expenses (with optional filters)
 * Fix: Extract only `data` to prevent extra API response wrapping
 */
export const getExpenses = async (filters: {
  start_date?: string;
  end_date?: string;
  store_id?: string;
}) => {
  try {
    const response = await axiosInstance.get("/expenses", { params: filters });
    return response.data?.data || []; // ✅ Extract ONLY the data array
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * ✅ Add a new expense
 * Fix: Ensure the API response is structured correctly
 */
export const addExpense = async (expenseData: {
  store_id: number;
  description: string;
  amount: number;
  expense_date: string;
}) => {
  try {
    const response = await axiosInstance.post("/expenses/add", expenseData);
    return response.data?.data || null; // ✅ Ensure correct data handling
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * ✅ Update an existing expense
 * Fix: Extract updated expense data properly
 */
export const updateExpense = async (
  id: number,
  expenseData: {
    store_id: number;
    description: string;
    amount: number;
    expense_date: string;
  }
) => {
  try {
    const response = await axiosInstance.put(`/expenses/${id}`, expenseData);
    return response.data?.data || null; // ✅ Extract only updated data
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * ✅ Delete an expense by ID
 * Fix: Handle deletion without returning unnecessary data
 */
export const deleteExpense = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/expenses/${id}`);
  } catch (error) {
    throw new Error(`Failed to delete expense: ${error.message}`);
  }
};
