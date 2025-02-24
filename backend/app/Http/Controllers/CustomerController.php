<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Customer;
use App\Models\LoyaltyPoint;
use App\Services\ResponseService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;

class CustomerController extends Controller
{
    /**
     * ✅ Fetch All Customers (With Optional Search & Pagination)
     */
    public function index(Request $request)
    {
        $query = Customer::query();

        // ✅ Optional search query
        if ($request->has('search')) {
            $search = $request->search;
            $query->where('name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%")
                ->orWhere('phone', 'like', "%{$search}%")
                ->orWhere('barcode', 'like', "%{$search}%")
                ->orWhere('qr_code', 'like', "%{$search}%");
        }

        return response()->json([
            'success' => true,
            'message' => 'Customers retrieved successfully.',
            'data' => $query->paginate(15), // ✅ Paginate results
        ]);
    }

    /**
     * ✅ Register a New Customer
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|min:2',
                'email' => 'nullable|email|unique:customers,email',
                'phone' => 'nullable|string|min:7',
                'address' => 'nullable|string',
                'city' => 'nullable|string',
                'state' => 'nullable|string',
                'zip_code' => 'nullable|string',
            ]);

            DB::beginTransaction();

            // ✅ Auto-generate unique barcode & QR code
            do {
                $barcode = Str::random(10); // Generate random 10-character barcode
            } while (Customer::where('barcode', $barcode)->exists());

            do {
                $qr_code = Str::uuid()->toString(); // Generate UUID as QR code
            } while (Customer::where('qr_code', $qr_code)->exists());

            // ✅ Add barcode & QR code to validated data
            $validated['barcode'] = $barcode;
            $validated['qr_code'] = $qr_code;

            $customer = Customer::create($validated);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Customer registered successfully.',
                'data' => $customer,
            ]);
        } catch (ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Validation error.',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while registering the customer.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * ✅ Get Customer Details by ID
     */
    public function show($id)
    {
        $customer = Customer::find($id);

        if (!$customer) {
            return response()->json([
                'success' => false,
                'message' => 'Customer not found.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Customer retrieved successfully.',
            'data' => $customer,
        ]);
    }

    /**
     * ✅ Update Customer Details
     */
    public function update(Request $request, $id)
    {
        $customer = Customer::find($id);

        if (!$customer) {
            return response()->json([
                'success' => false,
                'message' => 'Customer not found.',
            ], 404);
        }

        try {
            $validated = $request->validate([
                'name' => 'required|string|min:2',
                'email' => 'nullable|email|unique:customers,email,' . $id,
                'phone' => 'nullable|string|min:7',
                'barcode' => 'nullable|string|unique:customers,barcode,' . $id,
                'qr_code' => 'nullable|string|unique:customers,qr_code,' . $id,
                'address' => 'nullable|string',
                'city' => 'nullable|string',
                'state' => 'nullable|string',
                'zip_code' => 'nullable|string',
            ]);

            $customer->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Customer updated successfully.',
                'data' => $customer,
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error.',
                'errors' => $e->errors(),
            ], 422);
        }
    }

    /**
     * ✅ Delete Customer (Soft Delete)
     */
    public function destroy($id)
    {
        $customer = Customer::find($id);

        if (!$customer) {
            return response()->json([
                'success' => false,
                'message' => 'Customer not found.',
            ], 404);
        }

        $customer->delete();

        return response()->json([
            'success' => true,
            'message' => 'Customer deleted successfully.',
        ]);
    }

    /**
     * ✅ Restore Soft Deleted Customer
     */
    public function restore($id)
    {
        $customer = Customer::withTrashed()->find($id);

        if (!$customer || !$customer->trashed()) {
            return response()->json([
                'success' => false,
                'message' => 'Customer not found or not archived.',
            ], 404);
        }

        $customer->restore();

        return response()->json([
            'success' => true,
            'message' => 'Customer restored successfully.',
            'data' => $customer,
        ]);
    }

    /**
     * ✅ Permanently Delete Customer
     */
    public function forceDelete($id)
    {
        $customer = Customer::withTrashed()->find($id);

        if (!$customer) {
            return response()->json([
                'success' => false,
                'message' => 'Customer not found.',
            ], 404);
        }

        $customer->forceDelete();

        return response()->json([
            'success' => true,
            'message' => 'Customer permanently deleted.',
        ]);
    }
    public function searchByBarcode(Request $request)
    {
        $barcode = trim($request->query('barcode'));

        Log::info("🔍 Searching for customer with barcode: " . $barcode);

        // ✅ Ensure barcode is searched case-insensitively
        $customer = Customer::whereRaw('BINARY barcode = ?', [$barcode])
            ->whereNull('deleted_at') // Ensure not soft-deleted
            ->first();

        if (!$customer) {
            Log::warning("❌ Customer not found for barcode: " . $barcode);
            return response()->json([
                'success' => false,
                'message' => 'Customer not found.',
            ], 404);
        }

        Log::info("✅ Customer found: " . json_encode($customer));

        return response()->json([
            'success' => true,
            'data' => $customer,
        ]);
    }
    public function getCustomersWithLoyaltyPoints()
    {
        try {
            // ✅ Fetch customers with their loyalty points (joins `customers` and `loyalty_points`)
            $customers = Customer::leftJoin('loyalty_points', 'customers.id', '=', 'loyalty_points.customer_id')
                ->select(
                    'customers.id',
                    'customers.name',
                    'customers.email',
                    'customers.phone',
                    'customers.barcode',
                    'customers.qr_code',
                    DB::raw('COALESCE(SUM(loyalty_points.points), 0) as total_points')
                )
                ->groupBy('customers.id', 'customers.name', 'customers.email', 'customers.phone', 'customers.barcode', 'customers.qr_code')
                ->get();

            return ResponseService::success("Customers with loyalty points retrieved successfully", $customers);
        } catch (\Exception $e) {
            \Log::error('Error fetching customers with loyalty points:', ['error' => $e->getMessage()]);
            return ResponseService::error("Failed to fetch customers", $e->getMessage());
        }
    }
    public function claimLoyaltyPoints(Request $request)
    {
        try {
            // ✅ Validate Input
            $request->validate([
                'customer_id' => 'required|exists:customers,id',
                'points_to_claim' => 'required|integer|min:1',
            ]);

            $customerId = $request->customer_id;
            $pointsToClaim = $request->points_to_claim;

            // ✅ Get Customer's Total Loyalty Points
            $totalPoints = LoyaltyPoint::where('customer_id', $customerId)->sum('points');

            // ✅ Check if Customer Has Enough Points
            if ($totalPoints < $pointsToClaim) {
                return ResponseService::error("Insufficient loyalty points. Customer only has $totalPoints points.");
            }

            // ✅ Deduct Points (FIFO - Oldest First)
            $remainingPointsToDeduct = $pointsToClaim;
            $loyaltyRecords = LoyaltyPoint::where('customer_id', $customerId)
                ->orderBy('created_at', 'asc') // Oldest first
                ->get();

            foreach ($loyaltyRecords as $record) {
                if ($remainingPointsToDeduct <= 0) {
                    break;
                }

                if ($record->points <= $remainingPointsToDeduct) {
                    // Remove entire record
                    $remainingPointsToDeduct -= $record->points;
                    $record->delete();
                } else {
                    // Partially deduct points from the record
                    $record->points -= $remainingPointsToDeduct;
                    $record->save();
                    $remainingPointsToDeduct = 0;
                }
            }

            return ResponseService::success("Loyalty points successfully claimed.", [
                'customer_id' => $customerId,
                'claimed_points' => $pointsToClaim,
                'remaining_points' => LoyaltyPoint::where('customer_id', $customerId)->sum('points'),
            ]);
        } catch (\Exception $e) {
            \Log::error('Error claiming loyalty points:', ['error' => $e->getMessage()]);
            return ResponseService::error("Failed to claim loyalty points", $e->getMessage());
        }
    }
}
