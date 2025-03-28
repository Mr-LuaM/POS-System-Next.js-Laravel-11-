<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\StockMovement;
use App\Models\StoreProduct;
use App\Models\Payment;
use App\Models\Refund;
use App\Models\CashDrawer;
use App\Models\UserActivityLog;
use App\Services\ResponseService;

class RefundController extends Controller
{
    public function getAll(Request $request)
    {
        try {
            $user = Auth::user();

            // 🔹 Fetch all refunds with related sale details
            $query = Refund::with(['sale.store', 'sale.user', 'sale.customer']);

            // 🔹 Restrict non-admin users to their store refunds
            if ($user->role !== 'admin') {
                $query->whereHas('sale', function ($q) use ($user) {
                    $q->where('store_id', $user->store_id);
                });
            }

            $refunds = $query->latest()->get();

            // ✅ Format the data for the frontend
            $formattedRefunds = $refunds->map(function ($refund) {
                return [
                    'id' => $refund->id,
                    'sale_id' => $refund->sale_id,
                    'store_name' => $refund->sale->store->name ?? 'Unknown Store',
                    'cashier_name' => $refund->sale->user->name ?? 'Unknown Cashier',
                    'customer_name' => $refund->sale->customer->name ?? 'Guest',
                    'amount' => $refund->amount,
                    'reason' => $refund->reason,
                    'created_at' => $refund->created_at,
                ];
            });

            return ResponseService::success("Refunds fetched successfully", $formattedRefunds);
        } catch (\Exception $e) {
            return ResponseService::error("Failed to fetch refunds", $e->getMessage());
        }
    }
    /**
     * ✅ Process a refund (Only Admins & Managers)
     */
    public function processRefund(Request $request, $saleId)
    {
        try {
            $user = Auth::user();

            // ✅ Restrict Refunds to Admins & Managers
            if (!in_array($user->role, ['admin', 'manager'])) {
                return ResponseService::error("Unauthorized. Only admins & managers can process refunds.", null, 403);
            }

            $sale = Sale::with(['saleItems', 'payments'])->findOrFail($saleId);

            // ✅ Prevent double refunds
            if ($sale->status === "refunded") {
                return ResponseService::error("This sale has already been refunded.", null, 400);
            }

            DB::beginTransaction();

            // ✅ Step 1: Reverse Inventory
            foreach ($sale->saleItems as $item) {
                $storeProduct = StoreProduct::where('product_id', $item->product_id)
                    ->where('store_id', $sale->store_id)
                    ->first();

                if ($storeProduct) {
                    $storeProduct->increment('stock_quantity', $item->quantity);

                    // ✅ Log Stock Movement
                    StockMovement::create([
                        'store_product_id' => $storeProduct->id,
                        'type' => 'restock',
                        'quantity' => $item->quantity,
                        'reason' => "Refund for Sale #{$sale->id}",
                    ]);
                }
            }

            // ✅ Step 2: Update Sale Status
            $sale->update(['status' => 'refunded']);

            // ✅ Step 3: Reverse Payments
            foreach ($sale->payments as $payment) {
                Payment::create([
                    'sale_id' => $sale->id,
                    'amount' => -$payment->amount,
                    'method' => $payment->method,
                    'transaction_id' => "REFUND-{$sale->id}",
                ]);
            }

            // ✅ Step 4: Update Cash Drawer
            CashDrawer::where('id', $sale->cash_drawer_id)->decrement('closing_balance', $sale->total_amount);

            // ✅ Step 5: **Create Refund Entry in `refunds` Table** (Fix Missing Record)
            Refund::create([
                'sale_id' => $sale->id,
                'amount' => $sale->total_amount,
                'reason' => "Refund processed by {$user->name}",
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // ✅ Step 6: Log Refund Action
            UserActivityLog::create([
                'user_id' => $user->id,
                'action' => 'Processed Refund',
                'details' => "Refunded Sale #{$sale->id} for ₱{$sale->total_amount}",
            ]);

            DB::commit();

            return ResponseService::success("Refund processed successfully.", ["sale_id" => $sale->id]);
        } catch (\Exception $e) {
            DB::rollBack();
            return ResponseService::error("Refund failed.", $e->getMessage());
        }
    }
}
