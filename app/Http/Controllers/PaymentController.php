<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Payment;
use App\Models\Sale;
use App\Services\ResponseService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Auth;

class PaymentController extends Controller
{
    /**
     * ✅ Get all payments (Admins see all, others see store-specific)
     */
    public function getAll(Request $request)
    {
        try {
            $user = Auth::user();

            // 🔹 Base Query: Fetch all payments with related sales
            $query = Payment::with([
                'sale' => function ($q) {
                    $q->select('id', 'store_id', 'user_id', 'total_amount', 'status')
                        ->with(['store:id,name', 'user:id,name']);
                }
            ]);

            // 🔹 Restrict non-admin users to their store
            if ($user->role !== 'admin') {
                $query->whereHas('sale', function ($q) use ($user) {
                    $q->where('store_id', $user->store_id);
                });
            }

            $payments = $query->latest()->get();

            // ✅ Format the data for frontend
            $formattedPayments = $payments->map(function ($payment) {
                return [
                    'id' => $payment->id,
                    'sale_id' => $payment->sale->id ?? null,
                    'store_name' => $payment->sale->store->name ?? 'Unknown Store',
                    'cashier_name' => $payment->sale->user->name ?? 'Unknown Cashier',
                    'amount' => $payment->amount,
                    'method' => $payment->method,
                    'transaction_id' => $payment->transaction_id ?? 'N/A',
                    'created_at' => $payment->created_at,
                ];
            });

            return ResponseService::success("Payments fetched successfully", $formattedPayments);
        } catch (\Exception $e) {
            return ResponseService::error("Failed to fetch payments", $e->getMessage());
        }
    }
}
