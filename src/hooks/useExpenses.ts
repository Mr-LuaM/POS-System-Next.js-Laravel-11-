import { useState, useEffect } from "react";
import { getExpenses, addExpense, updateExpense, deleteExpense } from "@/services/expenses";

/**
 * ✅ Custom Hook for Managing Expenses (CRUD)
 */
export const useExpenses = () => {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  /**
   * ✅ Fetch Expenses from API
   */
  const fetchExpenses = async () => {
    setLoading(true);
    try {
        const data = await getExpenses();
        console.log(data);  // Check if the format is what you expect
        setExpenses(data);
        
    } catch (error) {
      console.error("Failed to fetch expenses", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * ✅ Add New Expense
   */
  const handleAddExpense = async (expense: any) => {
    await addExpense(expense);
    fetchExpenses(); // Refresh expense list after adding
  };

  /**
   * ✅ Update Existing Expense
   */
  const handleUpdateExpense = async (id: number, expense: any) => {
    await updateExpense(id, expense);
    fetchExpenses(); // Refresh after update
  };

  /**
   * ✅ Delete Expense
   */
  const handleDeleteExpense = async (id: number) => {
    await deleteExpense(id);
    fetchExpenses(); // Refresh after deletion
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return {
    expenses,
    loading,
    handleAddExpense,
    handleUpdateExpense,
    handleDeleteExpense,
    refreshExpenses: fetchExpenses,
  };
};
