<?php

namespace App\Http\Controllers;

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

            // ✅ Validate filters (date range, store, cashier)
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

            // 🔹 Filter by Store (if provided)
            if ($request->store_id) {
                $query->where('store_id', $request->store_id);
            }

            // 🔹 Filter by Cashier (if provided)
            if ($request->cashier_id) {
                $query->where('user_id', $request->cashier_id);
            }

            // 🔹 Restrict Non-Admin Users to their Store
            if ($user->role !== 'admin') {
                $query->where('store_id', $user->store_id);
            }

            // ✅ Aggregate Data
            $totalSales = $query->count();
            $totalRevenue = $query->sum('total_amount');

            // ✅ Get Best-Selling Products
            $bestSellingProducts = SaleItem::select('product_id', DB::raw('SUM(quantity) as total_sold'))
                ->whereIn('sale_id', $query->pluck('id'))
                ->groupBy('product_id')
                ->orderByDesc('total_sold')
                ->limit(5)
                ->with('product')
                ->get()
                ->map(fn($item) => [
                    'product_name' => $item->product->name,
                    'total_sold' => $item->total_sold
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
}
