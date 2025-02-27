<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\StockMovement;
use App\Models\Payment;
use App\Models\CashDrawer;
use App\Models\LoyaltyPoint;
use App\Models\UserActivityLog;
use App\Models\Receipt;
use App\Models\EmployeeShift;
use App\Models\StoreProduct;
use Carbon\Carbon;

class TransactionController extends Controller
{
    public function completeTransaction(Request $request)
    {
        \Log::info("🔍 Incoming Transaction Request: ", $request->all());

        $request->validate([
            'cashier_id' => 'required|exists:users,id',
            'store_id' => 'required|exists:stores,id',
            'customer_id' => 'nullable|exists:customers,id',
            'payment_methods' => 'required|array|min:1',
            'payment_methods.*.method' => 'required|string|in:cash,credit_card,digital_wallet',
            'payment_methods.*.amount' => 'required|numeric|min:0',
            'payment_methods.*.change' => 'required|numeric|min:0',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
            'discount_code' => 'nullable|string|exists:discounts,code',
        ]);

        try {
            DB::beginTransaction();

            // ✅ Auto-fetch Cash Drawer ID
            $cashDrawerId = EmployeeShift::where('user_id', $request->cashier_id)
                ->where('store_id', $request->store_id)
                ->whereNull('clock_out')
                ->value('cash_drawer_id');

            if (!$cashDrawerId) {
                return response()->json([
                    'success' => false,
                    'message' => '❌ No active cash drawer found for this cashier. Please start a shift first. ' . $request->cashier_id,
                ], 400);
            }

            // ✅ Calculate Total Amount
            $totalAmount = collect($request->items)->sum(fn($item) => $item['price'] * $item['quantity']);

            // ✅ Apply Discount (if applicable)
            $discountAmount = 0;
            if ($request->discount_code) {
                $discount = \App\Models\Discount::where('code', $request->discount_code)->first();
                if ($discount) {
                    $discountAmount = ($discount->discount_type === 'fixed')
                        ? $discount->discount_value
                        : ($totalAmount * $discount->discount_value) / 100;
                    $totalAmount -= $discountAmount;
                }
            }

            // ✅ Ensure payment methods cover total amount
            $totalPaid = collect($request->payment_methods)->sum('amount');
            if ($totalPaid < $totalAmount) {
                return response()->json([
                    'success' => false,
                    'message' => '❌ Total payment amount is less than the total sale amount.',
                ], 400);
            }

            // ✅ Step 1: Create Sale Record
            $sale = Sale::create([
                'user_id' => $request->cashier_id,
                'store_id' => $request->store_id,
                'customer_id' => $request->customer_id,
                'total_amount' => $totalAmount,
                'status' => 'completed',
                'cash_drawer_id' => $cashDrawerId,
            ]);

            // ✅ Step 2: Process Each Item
            foreach ($request->items as $item) {
                // 🔹 **Automatically Fetch `store_product_id`**
                $storeProduct = StoreProduct::where('product_id', $item['product_id'])
                    ->where('store_id', $request->store_id)
                    ->first();

                if (!$storeProduct) {
                    return response()->json([
                        'success' => false,
                        'message' => "❌ Product ID {$item['product_id']} is not available in store {$request->store_id}.",
                    ], 400);
                }

                // 🔹 Record Sale Item
                SaleItem::create([
                    'sale_id' => $sale->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'subtotal' => $item['price'] * $item['quantity'],
                ]);

                // 🔹 Deduct Stock & Track Movement
                StockMovement::create([
                    'store_product_id' => $storeProduct->id, // ✅ Auto-fetched
                    'type' => 'sale',
                    'quantity' => -$item['quantity'],
                    'reason' => "Sold in sale #{$sale->id}",
                ]);

                // 🔹 Update Store Product Stock
                $storeProduct->decrement('stock_quantity', $item['quantity']);
            }

            // ✅ Step 3: Record Payments
            foreach ($request->payment_methods as $payment) {
                Payment::create([
                    'sale_id' => $sale->id,
                    'amount' => $payment['amount'],
                    'method' => $payment['method'],
                    'change' => $payment['change'],
                ]);
            }

            // // ✅ Step 4: Update Cash Drawer Balance
            // CashDrawer::where('id', $cashDrawerId)->increment('closing_balance', $totalAmount);

            // ✅ Step 5: Loyalty Points (if customer exists)
            if ($request->customer_id) {
                LoyaltyPoint::updateOrCreate(
                    ['customer_id' => $request->customer_id],
                    ['points' => DB::raw("points + FLOOR({$totalAmount} / 10)")]
                );
            }

            // ✅ Step 6: Generate Receipt
            Receipt::create([
                'sale_id' => $sale->id,
                'receipt_template' => "Receipt for Sale #{$sale->id}",
            ]);

            // ✅ Step 7: Log User Activity
            UserActivityLog::create([
                'user_id' => $request->cashier_id,
                'action' => 'Completed Sale',
                'details' => "Sale ID: {$sale->id}, Amount: {$totalAmount}",
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => '✅ Transaction completed successfully!',
                'sale_id' => $sale->id,
                'change' => collect($request->payment_methods)->sum('change'),
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => '❌ Transaction failed!',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
