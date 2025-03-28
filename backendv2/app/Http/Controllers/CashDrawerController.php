<?php

namespace App\Http\Controllers;

use App\Models\CashDrawer;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CashDrawerController extends Controller
{
    public function updateClosingBalance(Request $request, $id)
    {
        $cashDrawer = CashDrawer::find($id);
        if (!$cashDrawer) {
            return response()->json(['message' => 'Cash drawer not found'], 404);
        }

        $validated = $request->validate([
            'closing_balance' => 'required|numeric|min:0',
        ]);

        $cashDrawer->closing_balance = $validated['closing_balance'];
        $cashDrawer->save();

        return response()->json(['message' => 'Closing balance updated successfully']);
    }

    /**
     * ✅ Get Cash Drawer Status for a Store (Short, Over, or Balanced)
     */
    public function checkCashVariance($store_id)
    {
        $today = Carbon::today();

        $cashDrawers = DB::table('cash_drawers AS cd')
            ->leftJoin('sales AS s', function ($join) {
                $join->on('cd.store_id', '=', 's.store_id')
                    ->on('cd.id', '=', 's.cash_drawer_id')
                    ->where('s.status', '=', 'completed');
            })
            ->leftJoin('payments AS p', 's.id', '=', 'p.sale_id')
            ->select(
                'cd.store_id',
                'cd.opening_balance',
                'cd.closing_balance',
                'cd.actual_cash_collected',
                DB::raw('IFNULL(SUM(p.amount), 0) AS total_collected'),
                DB::raw('IFNULL(SUM(s.total_amount), 0) AS total_sales'),
                DB::raw('(IFNULL(SUM(p.amount), 0) - IFNULL(SUM(s.total_amount), 0)) AS total_change_given'),
                DB::raw('(cd.actual_cash_collected - IFNULL(SUM(p.amount), 0)) AS variance'),
                DB::raw("
                    CASE 
                        WHEN cd.actual_cash_collected IS NULL THEN 'Pending Verification'
                        WHEN cd.actual_cash_collected < IFNULL(SUM(p.amount), 0) THEN 'Short'
                        WHEN cd.actual_cash_collected > IFNULL(SUM(p.amount), 0) THEN 'Over'
                        ELSE 'Balanced'
                    END AS status
                ")
            )
            ->whereDate('cd.created_at', $today)
            ->groupBy('cd.store_id', 'cd.opening_balance', 'cd.closing_balance', 'cd.actual_cash_collected')
            ->first();

        return response()->json([
            'success' => true,
            'data' => $cashDrawers
        ]);
    }

    /**
     * ✅ Update Actual Cash Collected (Final Count at End of Shift)
     */
    public function updateActualCash(Request $request, $cashDrawerId)
    {
        $request->validate([
            'actual_cash_collected' => 'required|numeric|min:0',
        ]);

        // ✅ Find the specific cash drawer by ID (no date filtering)
        $cashDrawer = CashDrawer::find($cashDrawerId);

        if (!$cashDrawer) {
            return response()->json([
                'success' => false,
                'message' => 'Cash drawer not found.'
            ], 404);
        }

        // ✅ Update the actual cash collected
        $cashDrawer->actual_cash_collected = $request->actual_cash_collected;
        $cashDrawer->save();

        return response()->json([
            'success' => true,
            'message' => 'Actual cash collected updated successfully.',
            'data' => $cashDrawer
        ]);
    }

    /**
     * ✅ Get Cash Drawer Summary for the Day
     */
    public function getDailyCashSummary($store_id)
    {
        $today = Carbon::today();

        $summary = DB::table('cash_drawers AS cd')
            ->leftJoin('sales AS s', function ($join) {
                $join->on('cd.store_id', '=', 's.store_id')
                    ->on('cd.id', '=', 's.cash_drawer_id')
                    ->where('s.status', '=', 'completed');
            })
            ->leftJoin('payments AS p', 's.id', '=', 'p.sale_id')
            ->select(
                'cd.store_id',
                'cd.opening_balance',
                'cd.closing_balance',
                'cd.actual_cash_collected',
                DB::raw('IFNULL(SUM(p.amount), 0) AS total_collected'),
                DB::raw('IFNULL(SUM(s.total_amount), 0) AS total_sales'),
                DB::raw('(IFNULL(SUM(p.amount), 0) - IFNULL(SUM(s.total_amount), 0)) AS total_change_given'),
                DB::raw('(cd.actual_cash_collected - IFNULL(SUM(p.amount), 0)) AS variance'),
                DB::raw("
                    CASE 
                        WHEN cd.actual_cash_collected IS NULL THEN 'Pending Verification'
                        WHEN cd.actual_cash_collected < IFNULL(SUM(p.amount), 0) THEN 'Short'
                        WHEN cd.actual_cash_collected > IFNULL(SUM(p.amount), 0) THEN 'Over'
                        ELSE 'Balanced'
                    END AS status
                ")
            )
            ->whereDate('cd.created_at', $today)
            ->groupBy('cd.store_id', 'cd.opening_balance', 'cd.closing_balance', 'cd.actual_cash_collected')
            ->first();

        return response()->json([
            'success' => true,
            'data' => $summary
        ]);
    }
    public function getAllCashDrawers($store_id)
    {
        $cashDrawers = DB::table('employee_shifts AS es')
            ->leftJoin('cash_drawers AS cd', 'es.cash_drawer_id', '=', 'cd.id')
            ->leftJoin('users AS u', 'es.user_id', '=', 'u.id')
            ->leftJoin('sales AS s', function ($join) {
                $join->on('cd.id', '=', 's.cash_drawer_id')
                    ->where('s.status', '=', 'completed');
            })
            ->leftJoin('payments AS p', function ($join) {
                $join->on('s.id', '=', 'p.sale_id')
                    ->where('p.method', '=', 'cash'); // ✅ Only consider cash payments
            })
            ->select(
                'cd.id AS cash_drawer_id',
                'cd.store_id',
                'u.id AS cashier_id',
                'u.name AS cashier_name',
                'cd.opening_balance',
                'cd.closing_balance',
                'cd.actual_cash_collected',
                'cd.created_at AS cash_drawer_opened',
                'cd.updated_at AS last_updated',
                'es.clock_in',
                'es.clock_out AS shift_closed',
                DB::raw('DATE(cd.created_at) AS cash_drawer_date'),
                DB::raw('DATE(es.clock_in) AS shift_date'),
                DB::raw('IFNULL(SUM(s.total_amount), 0) AS total_sales'),
                DB::raw('IFNULL(SUM(p.amount), 0) AS total_collected'),
                // ✅ Dynamically Calculate Change Given
                DB::raw('GREATEST(IFNULL(SUM(p.amount), 0) - IFNULL(SUM(s.total_amount), 0), 0) AS total_change_given'),
                DB::raw('(cd.actual_cash_collected - (cd.opening_balance + IFNULL(SUM(p.amount), 0) - GREATEST(IFNULL(SUM(p.amount), 0) - IFNULL(SUM(s.total_amount), 0), 0))) AS variance'),
                // ✅ Calculate Drawer Balance
                DB::raw('(cd.opening_balance + IFNULL(SUM(p.amount), 0) - GREATEST(IFNULL(SUM(p.amount), 0) - IFNULL(SUM(s.total_amount), 0), 0)) AS drawer_balance'),
                DB::raw("
    CASE 
        WHEN cd.actual_cash_collected IS NULL THEN 'Pending Verification'
        WHEN cd.actual_cash_collected < (cd.opening_balance + IFNULL(SUM(p.amount), 0) - GREATEST(IFNULL(SUM(p.amount), 0) - IFNULL(SUM(s.total_amount), 0), 0)) THEN 'Short'
        WHEN cd.actual_cash_collected > (cd.opening_balance + IFNULL(SUM(p.amount), 0) - GREATEST(IFNULL(SUM(p.amount), 0) - IFNULL(SUM(s.total_amount), 0), 0)) THEN 'Over'
        ELSE 'Balanced'
    END AS status
")

            )
            ->where('cd.store_id', $store_id)
            ->whereNotNull('es.clock_in') // ✅ Only include active shifts
            ->groupBy(
                'cd.id',
                'cd.store_id',
                'u.id',
                'u.name',
                'cd.opening_balance',
                'cd.closing_balance',
                'cd.actual_cash_collected',
                'cd.created_at',
                'cd.updated_at',
                'es.clock_in',
                'es.clock_out'
            )
            ->orderBy('cd.created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $cashDrawers
        ]);
    }
}
