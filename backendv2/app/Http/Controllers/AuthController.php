<?php

namespace App\Http\Controllers;

use App\Models\CashDrawer;
use App\Models\EmployeeShift;
use Illuminate\Http\Request;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|in:admin,cashier,manager',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ]);

        return response()->json(['message' => 'User registered successfully']);
    }
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $credentials = $request->only('email', 'password');

        if (!auth()->attempt($credentials)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $user = auth()->user();
        $token = $user->createToken('POS-Auth')->accessToken;

        // ✅ Default Values
        $cashDrawerId = null;
        $openingBalance = 0.00;

        if ($user->role === 'cashier') {
            $storeId = $user->store_id;
            $currentTime = Carbon::now();

            // ✅ Start a database transaction to ensure consistency
            DB::beginTransaction();

            try {
                // ✅ Find last completed shift (DO NOT reuse active shifts)
                $lastShift = EmployeeShift::where('user_id', $user->id)
                    ->where('store_id', $storeId)
                    ->whereNotNull('clock_out') // ✅ Only past shifts
                    ->orderBy('clock_out', 'desc') // ✅ Get the most recent shift
                    ->first();

                if ($lastShift) {
                    // ✅ Find the cash drawer used in the last shift
                    $lastCashDrawer = CashDrawer::find($lastShift->cash_drawer_id);
                    if ($lastCashDrawer) {
                        $openingBalance = $lastCashDrawer->closing_balance ?? 0.00;
                    }
                }

                // ✅ Create a NEW cash drawer for today
                $cashDrawer = CashDrawer::create([
                    'store_id' => $storeId,
                    'opening_balance' => $openingBalance, // ✅ Use last closing balance
                    'closing_balance' => null, // ✅ New drawer is OPEN
                    'actual_cash_collected' => null,
                ]);

                // ✅ Create a NEW shift for today
                $newShift = EmployeeShift::create([
                    'user_id' => $user->id,
                    'store_id' => $storeId,
                    'cash_drawer_id' => $cashDrawer->id, // ✅ Assign new cash drawer
                    'clock_in' => $currentTime,
                    'clock_out' => null, // ✅ This shift is active
                    'total_sales' => 0, // Default starting sales
                ]);

                $cashDrawerId = $cashDrawer->id;

                // ✅ Commit the transaction
                DB::commit();
            } catch (\Exception $e) {
                DB::rollback(); // ✅ Rollback in case of errors
                return response()->json([
                    'message' => 'An error occurred while starting the shift.',
                    'error' => $e->getMessage()
                ], 500);
            }
        }

        return response()->json([
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'store_id' => $user->store_id,
                'cash_drawer_id' => $cashDrawerId,
                'opening_balance' => $openingBalance, // ✅ Include the correct starting balance
            ],
        ], 200);
    }



    public function logout(Request $request)
    {
        $user = $request->user();

        // ✅ If user is a cashier, mark the shift as closed
        if ($user->role === 'cashier') {
            $currentTime = Carbon::now();

            DB::beginTransaction(); // ✅ Ensure transaction safety

            try {
                // ✅ Find active shift for the cashier
                $activeShift = EmployeeShift::where('user_id', $user->id)
                    ->whereNull('clock_out') // Shift is still open
                    ->first();

                if ($activeShift) {
                    // ✅ Close the shift
                    $activeShift->clock_out = $currentTime;
                    $activeShift->save();

                    // ✅ Find the associated cash drawer
                    $cashDrawer = CashDrawer::find($activeShift->cash_drawer_id);
                    if ($cashDrawer) {
                        // ✅ Set closing balance = actual collected cash
                        $cashDrawer->closing_balance = $cashDrawer->actual_cash_collected ?? 0.00;
                        $cashDrawer->save();
                    }
                }

                // ✅ Delete access token (Log out)
                $user->tokens()->delete();

                DB::commit(); // ✅ Save all changes
            } catch (\Exception $e) {
                DB::rollback(); // ❌ If error occurs, revert changes
                return response()->json([
                    'message' => 'Failed to log out. Please try again.',
                    'error' => $e->getMessage(),
                ], 500);
            }

            return response()->json(['message' => 'Shift closed and logged out successfully.']);
        }

        // ✅ For non-cashiers, just log out
        $request->user()->tokens()->delete();
        return response()->json(['message' => 'Logged out successfully.']);
    }
    public function user(Request $request)
    {
        return response()->json($request->user());
    }
}
