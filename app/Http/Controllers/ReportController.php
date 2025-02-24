<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\Store;
use App\Services\ResponseService;

class ReportController extends Controller
{
    /**
     * ✅ Generate Sales Report
     */
    public function salesReport(Request $request)
    {
        try {
            $user = Auth::user();

            // ✅ Validate filters
            $request->validate([
                'start_date' => 'nullable|date',
                'end_date' => 'nullable|date|after_or_equal:start_date',
                'store_id' => 'nullable|exists:stores,id',
                'cashier_id' => 'nullable|exists:users,id',
            ]);

            // ✅ Base Query
            $query = Sale::with(['store', 'user', 'saleItems.product'])
                ->whereBetween('created_at', [
                    $request->start_date ?? now()->startOfMonth(),
                    $request->end_date ?? now()->endOfMonth(),
                ]);

            // 🔹 Apply Filters
            if ($request->store_id) {
                $query->where('store_id', $request->store_id);
            }

            if ($request->cashier_id) {
                $query->where('user_id', $request->cashier_id);
            }

            if ($user->role !== 'admin') {
                $query->where('store_id', $user->store_id);
            }

            // ✅ Aggregates
            $totalSales = $query->count();
            $totalRevenue = (float) $query->sum('total_amount'); // 🔧 Ensure float

            // ✅ Best-Selling Products with Correct Revenue Calculation
            $bestSellingProducts = SaleItem::select(
                'product_id',
                DB::raw('SUM(quantity) as total_sold'),
                DB::raw('SUM(subtotal) as total_revenue_per_product')  // 🔧 Use subtotal instead of price
            )
                ->whereIn('sale_id', $query->pluck('id'))
                ->groupBy('product_id')
                ->orderByDesc('total_sold')
                ->limit(5)
                ->with('product')
                ->get()
                ->map(fn($item) => [
                    'product_name' => $item->product->name,
                    'total_sold' => $item->total_sold,
                    'sale_amount' => (float) $item->total_revenue_per_product, // 🔧 Ensure float
                ]);

            return ResponseService::success("Sales report generated successfully", [
                'total_sales' => $totalSales,
                'total_revenue' => $totalRevenue,
                'best_selling_products' => $bestSellingProducts,
            ]);
        } catch (\Exception $e) {
            return ResponseService::error("Failed to fetch sales report", $e->getMessage());
        }
    }
    public function analyticsReport(Request $request)
    {
        try {
            $user = Auth::user();

            // ✅ Validate filters
            $request->validate([
                'start_date' => 'nullable|date',
                'end_date' => 'nullable|date|after_or_equal:start_date',
                'store_id' => 'nullable|exists:stores,id',
                'cashier_id' => 'nullable|exists:users,id',
            ]);

            // ✅ Set Date Range (Defaults to Current Month)
            $startDate = $request->start_date ?? now()->startOfMonth()->toDateString();
            $endDate = $request->end_date ?? now()->endOfMonth()->toDateString();

            // ✅ Base Query Using Eloquent
            $query = Sale::with(['store', 'user', 'saleItems.product'])
                ->whereBetween('created_at', [$startDate, $endDate]);

            // 🔹 Apply Filters
            if ($request->store_id) {
                $query->where('store_id', $request->store_id);
            }

            if ($request->cashier_id) {
                $query->where('user_id', $request->cashier_id);
            }

            if ($user->role !== 'admin') {
                $query->where('store_id', $user->store_id);
            }

            // ✅ Aggregates
            $totalSales = $query->count();
            $totalRevenue = (float) $query->sum('total_amount');

            // ✅ Get Sale IDs safely
            $saleIds = $query->exists() ? $query->pluck('id')->toArray() : [];

            // ✅ Total Profit Calculation (Handles Missing Products)
            $totalProfit = SaleItem::whereIn('sale_id', $saleIds)
                ->with('product')
                ->get()
                ->sum(function ($item) {
                    $product = $item->product ?? Product::withTrashed()->find($item->product_id);
                    return $product ? ($item->subtotal - ($product->price * $item->quantity)) : 0;
                });

            // ✅ Total Expenses Calculation (During Date Range)
            $totalExpenses = Expense::whereBetween('expense_date', [$startDate, $endDate])
                ->sum('amount');

            // ✅ Net Income Calculation
            $netIncome = $totalRevenue - $totalExpenses;

            // ✅ Sales Trend Chart
            $salesTrend = $query->selectRaw("DATE(created_at) as sales_date, SUM(total_amount) as revenue")
                ->groupByRaw("DATE(created_at)")
                ->orderByRaw("DATE(created_at) ASC")
                ->get();

            // ✅ Best-Selling Products
            $bestSellingProducts = !empty($saleIds) ? SaleItem::whereIn('sale_id', $saleIds)
                ->select(
                    'product_id',
                    DB::raw('SUM(quantity) as total_sold'),
                    DB::raw('SUM(subtotal) as total_revenue_per_product')
                )
                ->groupBy('product_id')
                ->orderByDesc('total_sold')
                ->limit(5)
                ->get()
                ->map(function ($item) {
                    $product = Product::withTrashed()->find($item->product_id);
                    return [
                        'product_name' => $product ? $product->name : 'Unknown Product',
                        'total_sold' => $item->total_sold,
                        'sale_amount' => (float) $item->total_revenue_per_product,
                    ];
                }) : [];

            // ✅ Payment Methods Breakdown
            $paymentMethods = $query->select('payment_method', DB::raw('COUNT(*) as count'))
                ->groupBy('payment_method')
                ->get();

            return ResponseService::success("Analytics data retrieved successfully", [
                'total_sales' => $totalSales,
                'total_revenue' => $totalRevenue,
                'total_profit' => $totalProfit,
                'total_expenses' => $totalExpenses, // ✅ Added Expenses
                'net_income' => $netIncome, // ✅ Added Net Income
                'sales_trend' => $salesTrend,
                'best_selling_products' => $bestSellingProducts,
                'payment_methods' => $paymentMethods,
            ]);
        } catch (\Exception $e) {
            \Log::error('Analytics Report Error:', [
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString(),
            ]);

            return ResponseService::error("Failed to fetch analytics data", $e->getMessage());
        }
    }

    public function dashboard(Request $request)
    {
        try {
            $user = Auth::user();

            // ✅ Always Fetch Data for Current Month
            $startDate = $request->start_date ?? now()->startOfMonth()->toDateString();
            $endDate = $request->end_date ?? now()->toDateString(); // Today's date

            // ✅ Check if store_id is provided
            $storeId = $request->store_id ?? null;

            // ✅ Base Query Using Eloquent
            $query = Sale::with(['store', 'user', 'saleItems.product'])
                ->whereBetween('created_at', [$startDate, $endDate]);

            // 🔹 Apply Store ID Filter (If Provided)
            if ($storeId) {
                $query->where('store_id', $storeId);
            }

            // 🔹 Apply Filters (If Non-Admin)
            if ($user->role !== 'admin') {
                $query->where('store_id', $user->store_id);
            }

            // ✅ Aggregates
            $totalSales = $query->count();
            $totalRevenue = (float) $query->sum('total_amount');

            // ✅ Get Sale IDs Safely
            $saleIds = $query->exists() ? $query->pluck('id')->toArray() : [];

            // ✅ Total Profit Calculation
            $totalProfit = SaleItem::whereIn('sale_id', $saleIds)
                ->with('product')
                ->get()
                ->sum(function ($item) {
                    $product = $item->product ?? Product::withTrashed()->find($item->product_id);
                    return $product ? ($item->subtotal - ($product->price * $item->quantity)) : 0;
                });

            // ✅ Sales Trend Chart (Daily Revenue)
            $salesTrend = $query->selectRaw("DATE(created_at) as sales_date, SUM(total_amount) as revenue")
                ->groupByRaw("DATE(created_at)")
                ->orderByRaw("DATE(created_at) ASC")
                ->get();

            // ✅ Best-Selling Products
            $bestSellingProducts = !empty($saleIds) ? SaleItem::whereIn('sale_id', $saleIds)
                ->select(
                    'product_id',
                    DB::raw('SUM(quantity) as total_sold'),
                    DB::raw('SUM(subtotal) as total_revenue_per_product')
                )
                ->groupBy('product_id')
                ->orderByDesc('total_sold')
                ->limit(5)
                ->get()
                ->map(function ($item) {
                    $product = Product::withTrashed()->find($item->product_id);
                    return [
                        'product_name' => $product ? $product->name : 'Unknown Product',
                        'total_sold' => $item->total_sold,
                        'sale_amount' => (float) ($item->total_revenue_per_product ?? 0),
                    ];
                }) : [];

            // ✅ Fix Payment Methods Breakdown
            $paymentMethods = $query->select('payment_method', DB::raw('COUNT(*) as count'))
                ->groupBy('payment_method')
                ->get();

            /**
             * ✅ NEW: EXPENSES DATA (Filtered by Store)
             */

            $expenseQuery = Expense::whereBetween('expense_date', [$startDate, $endDate]);

            // 🔹 Apply Store ID Filter to Expenses (If Provided)
            if ($storeId) {
                $expenseQuery->where('store_id', $storeId);
            }

            // ✅ Total Expenses (Current Month)
            $totalExpenses = (float) $expenseQuery->sum('amount');

            // ✅ Net Income Calculation (Total Revenue - Total Expenses)
            $netIncome = $totalRevenue - $totalExpenses;

            // ✅ Expense Trend Chart (Daily Expenses)
            $expenseTrend = $expenseQuery->selectRaw("DATE(expense_date) as expense_date, SUM(amount) as total_expense")
                ->groupByRaw("DATE(expense_date)")
                ->orderByRaw("DATE(expense_date) ASC")
                ->get();

            // ✅ Expense Breakdown by Category
            $expenseBreakdown = $expenseQuery->select('description', DB::raw('SUM(amount) as total_spent'))
                ->groupBy('description')
                ->orderByDesc('total_spent')
                ->get();

            return ResponseService::success("Dashboard data retrieved successfully", [
                'total_sales' => $totalSales,
                'total_revenue' => $totalRevenue,
                'total_profit' => $totalProfit,
                'net_income' => $netIncome, // ✅ New Net Income Calculation
                'sales_trend' => $salesTrend,
                'best_selling_products' => $bestSellingProducts,
                'payment_methods' => $paymentMethods,

                // ✅ New Expense Data (Filtered by Store if Provided)
                'total_expenses' => $totalExpenses,
                'expense_trend' => $expenseTrend,
                'expense_breakdown' => $expenseBreakdown,
            ]);
        } catch (\Exception $e) {
            \Log::error('Dashboard Error:', [
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString(),
            ]);

            return ResponseService::error("Failed to fetch dashboard data", $e->getMessage());
        }
    }
}
