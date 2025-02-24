<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Expense;
use App\Models\Store;
use App\Services\ResponseService;

class ExpenseController extends Controller
{
    /**
     * ✅ Get All Expenses (With Store Name)
     */
    public function index(Request $request)
    {
        try {
            $user = Auth::user();

            // ✅ Validate filters
            $request->validate([
                'start_date' => 'nullable|date',
                'end_date' => 'nullable|date|after_or_equal:start_date',
                'store_id' => 'nullable|exists:stores,id',
            ]);

            // ✅ Fetch expenses within the date range
            $query = Expense::with('store')->whereBetween('expense_date', [
                $request->start_date ?? now()->startOfMonth()->toDateString(),
                $request->end_date ?? now()->toDateString(),
            ]);

            // 🔹 Filter by Store (If Non-Admin, only see their store)
            if ($user->role !== 'admin') {
                $query->where('store_id', $user->store_id);
            } elseif ($request->store_id) {
                $query->where('store_id', $request->store_id);
            }

            // ✅ Get all expenses
            $expenses = $query->orderBy('expense_date', 'desc')->get()
                ->map(fn($expense) => [
                    'id' => $expense->id,
                    'store_name' => $expense->store->name ?? 'Unknown Store',
                    'description' => $expense->description,
                    'amount' => (float) $expense->amount,
                    'expense_date' => $expense->expense_date,
                ]);

            return ResponseService::success("Expenses retrieved successfully", $expenses);
        } catch (\Exception $e) {
            return ResponseService::error("Failed to fetch expenses", $e->getMessage());
        }
    }

    /**
     * ✅ Add New Expense
     */
    public function store(Request $request)
    {
        try {
            $user = Auth::user();

            // ✅ Validate input
            $request->validate([
                'store_id' => 'required|exists:stores,id',
                'description' => 'required|string|max:255',
                'amount' => 'required|numeric|min:0',
                'expense_date' => 'required|date',
            ]);

            // 🔹 Restrict Non-Admin Users to Their Store
            if ($user->role !== 'admin' && $user->store_id != $request->store_id) {
                return ResponseService::error("Unauthorized", "You can only add expenses for your store.");
            }

            // ✅ Create Expense
            $expense = Expense::create($request->only(['store_id', 'description', 'amount', 'expense_date']));

            return ResponseService::success("Expense added successfully", $expense);
        } catch (\Exception $e) {
            return ResponseService::error("Failed to add expense", $e->getMessage());
        }
    }

    /**
     * ✅ Update Expense
     */
    public function update(Request $request, $id)
    {
        try {
            $user = Auth::user();
            $expense = Expense::findOrFail($id);

            // ✅ Validate input
            $request->validate([
                'store_id' => 'required|exists:stores,id',
                'description' => 'required|string|max:255',
                'amount' => 'required|numeric|min:0',
                'expense_date' => 'required|date',
            ]);

            // 🔹 Restrict Non-Admin Users to Their Store
            if ($user->role !== 'admin' && $user->store_id != $expense->store_id) {
                return ResponseService::error("Unauthorized", "You can only update expenses for your store.");
            }

            // ✅ Update Expense
            $expense->update($request->only(['store_id', 'description', 'amount', 'expense_date']));

            return ResponseService::success("Expense updated successfully", $expense);
        } catch (\Exception $e) {
            return ResponseService::error("Failed to update expense", $e->getMessage());
        }
    }
}
