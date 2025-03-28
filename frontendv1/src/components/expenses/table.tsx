"use client";

import { useState, useEffect } from "react";
import { useExpenses } from "@/hooks/useExpenses";
import { DataTable } from "@/components/common/data-table";
import { getExpenseColumns, Expense } from "./columns";
import ExpenseModal from "./expense-modal";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function ExpenseTable() {
  const { expenses, loading, handleAddExpense, handleUpdateExpense, handleDeleteExpense, refreshExpenses } =
    useExpenses();

  const [expenseData, setExpenseData] = useState<Expense | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  // ✅ Debugging: Ensure data is fetched
  useEffect(() => {
    console.log("Fetched expenses:", expenses);
  }, [expenses]);

  /**
   * ✅ Open Add Expense Modal
   */
  const openAddModal = () => {
    setExpenseData({
      id: 0,
      store_name: "",
      description: "",
      amount: 0,
      expense_date: "",
    });
    setModalOpen(true);
  };

  /**
   * ✅ Open Edit Expense Modal
   */
  const openEditModal = (expense: Expense) => {
    setExpenseData(expense);
    setModalOpen(true);
  };

  /**
   * ✅ Handle Delete Expense
   */
  const handleDelete = async (id: number) => {
    await handleDeleteExpense(id);
    refreshExpenses();
  };

  return (
    <div className="space-y-6">
      {/* ✅ Page Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">💰 Expenses</h1>
        <Button onClick={openAddModal}>+ Add Expense</Button>
      </div>

      {/* ✅ Expenses Table with Loading Skeleton */}
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : expenses?.length > 0 ? (
        <DataTable columns={getExpenseColumns(openEditModal, handleDelete)} data={expenses} />
      ) : (
        <p className="text-gray-500">No expenses found.</p>
      )}

      {/* ✅ Expense Modal */}
      {isModalOpen && (
       <ExpenseModal
       isOpen={isModalOpen}
       onClose={() => setModalOpen(false)}
       onSubmit={handleAddExpense} // ✅ Calls add function
       onUpdate={handleUpdateExpense} // ✅ Calls update function
       expenseData={expenseData}
       isEdit={!!expenseData?.id} // ✅ Correctly determines if editing
       refresh={refreshExpenses} // ✅ Refreshes expenses after action
     />
     
      )}
    </div>
  );
}
