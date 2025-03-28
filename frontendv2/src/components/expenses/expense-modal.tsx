"use client";

import { useEffect, useState } from "react";
import { useExpenses } from "@/hooks/useExpenses";
import { useStores } from "@/hooks/useStores"; // ✅ Import useStores hook
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormItem, FormLabel, FormControl, FormMessage, FormField } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

/**
 * ✅ Form Validation Schema (Using Zod)
 */
const expenseSchema = z.object({
  store_id: z.string().min(1, "Store is required"), // ✅ Ensure store is selected
  description: z.string().min(1, "Description is required"),
  amount: z.preprocess(
    (value) => Number(value) || 0,
    z.number().positive("Amount must be greater than zero")
  ),
  expense_date: z.string().min(1, "Date is required"),
  custom_store_name: z.string().optional(), // ✅ Allow entering a custom store
});

/**
 * ✅ Expense Modal (For Adding/Editing Expenses)
 */
export default function ExpenseModal({
  isOpen,
  onClose,
  expenseData,
  isEdit,
  refresh, // ✅ Refresh expenses after action
}: {
  isOpen: boolean;
  onClose: () => void;
  expenseData: any;
  isEdit: boolean;
  refresh: () => void;
}) {
  const { handleAddExpense, handleUpdateExpense } = useExpenses(); // ✅ Now actually using these!
  const { stores, loading } = useStores(); // ✅ Fetch stores for dropdown
  const [customStore, setCustomStore] = useState(false); // ✅ Track if user selects "Other"

  const form = useForm({
    resolver: zodResolver(expenseSchema),
    defaultValues: expenseData || {
      store_id: "",
      description: "",
      amount: 0,
      expense_date: "",
      custom_store_name: "",
    },
  });

  useEffect(() => {
    if (expenseData) {
      form.reset(expenseData); // ✅ Reset with existing data
      setCustomStore(expenseData.store_id === "other");
    } else {
      form.reset({ store_id: "", description: "", amount: 0, expense_date: "", custom_store_name: "" });
      setCustomStore(false);
    }
  }, [expenseData, form]);

  /**
   * ✅ Handle Form Submission (Now Correctly Differentiates Between Add & Edit)
   */
  const handleFormSubmit = async (data: any) => {
    try {
      if (isEdit) {
        await handleUpdateExpense(expenseData.id, data); // ✅ Calls update function
      } else {
        await handleAddExpense(data); // ✅ Calls add function
      }
      refresh(); // ✅ Refresh table after submission
      onClose();
    } catch (error) {
      console.error("Error saving expense:", error);
    }
  };

  if (isEdit && !expenseData) return null; // ✅ Prevents errors when expenseData is missing

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Expense" : "Add Expense"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            {/* ✅ Store Selection with "Other" Option */}
            <FormField
              control={form.control}
              name="store_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Store</FormLabel>
                  <Select
                    onValueChange={(val) => {
                      field.onChange(val);
                      setCustomStore(val === "other");
                    }}
                    value={field.value ?? ""}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Store" />
                    </SelectTrigger>
                    <SelectContent>
                      {loading && (
                        <SelectItem disabled value="loading">Loading stores...</SelectItem>
                      )}

                      {!loading && stores.length === 0 && (
                        <SelectItem disabled value="no_stores">No stores available</SelectItem>
                      )}

                      {!loading && stores.length > 0 &&
                        stores.map((store) => (
                          <SelectItem key={store.id} value={String(store.id)}> {/* ✅ Convert id to string */}
                            {store.name}
                          </SelectItem>
                        ))
                      }

                      <SelectItem value="other">Other (Enter New Store)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ✅ Custom Store Name Input (Only if "Other" is selected) */}
            {customStore && (
              <FormField
                control={form.control}
                name="custom_store_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Store Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter new store name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* ✅ Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ✅ Amount */}
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Amount" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ✅ Expense Date */}
            <FormField
              control={form.control}
              name="expense_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expense Date</FormLabel>
                  <FormControl>
                    <Input type="date" placeholder="Expense Date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">{isEdit ? "Update Expense" : "Add Expense"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
