<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Sale;
use App\Models\User;
use App\Models\Store;
use App\Models\Customer;
use App\Models\Payment;
use App\Models\SaleItem;
use App\Services\ResponseService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Auth;

class SalesController extends Controller
{
    /**
     * ✅ Get all sales transactions (Admins see all, others see store-specific)
     */
    public function getAll(Request $request)
    {
        try {
            $user = Auth::user();

            // 🔹 Fetch all sales with related details
            $query = Sale::with([
                'user:id,name',         // Fetch Cashier Name
                'store:id,name',        // Fetch Store Name
                'customer:id,name',     // Fetch Customer Name (optional)
                'payments:sale_id,method' // ✅ FIXED: Use `sale_id` instead of `paymentable_id`
            ]);

            // 🔹 Restrict non-admin users to their store
            if ($user->role !== 'admin') {
                $query->where('store_id', $user->store_id);
            }

            $sales = $query->latest()->get();

            // ✅ Format the data for the frontend
            $formattedSales = $sales->map(function ($sale) {
                return [
                    'id' => $sale->id,
                    'store_name' => $sale->store->name ?? 'Unknown Store',
                    'cashier_name' => $sale->user->name ?? 'Unknown Cashier',
                    'customer_name' => $sale->customer->name ?? 'Guest',
                    'total_amount' => $sale->total_amount,
                    'status' => $sale->status,
                    'payment_methods' => $sale->payments->pluck('method')->toArray(),
                    'created_at' => $sale->created_at
                ];
            });

            return ResponseService::success("Sales fetched successfully", $formattedSales);
        } catch (\Exception $e) {
            return ResponseService::error("Failed to fetch sales", $e->getMessage());
        }
    }
    public function getSaleItems($saleId)
    {
        try {
            $saleItems = SaleItem::where('sale_id', $saleId)
                ->with('product:id,name')
                ->get();

            $formattedItems = $saleItems->map(function ($item) {
                return [
                    'id' => $item->id,
                    'product_name' => $item->product->name ?? 'Unknown Product',
                    'quantity' => $item->quantity,
                    'price' => $item->subtotal / $item->quantity,
                    'total' => $item->subtotal,
                ];
            });

            return ResponseService::success("Sale items fetched successfully", $formattedItems);
        } catch (\Exception $e) {
            return ResponseService::error("Failed to fetch sale items", $e->getMessage());
        }
    }
}
