<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\EmployeeShift;
use App\Models\User;
use App\Models\Store;
use App\Models\CashDrawer;

class EmployeeShiftsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the first store
        $store = Store::first();

        // Find a cashier assigned to a store
        $cashier = User::where('role', 'cashier')->whereNotNull('store_id')->first();

        // Ensure there is a store and a cashier
        if (!$store || !$cashier) {
            echo "⚠️ No store or cashier found. Skipping shift seeding.\n";
            return;
        }

        // Find or create a cash drawer for the store
        $cashDrawer = CashDrawer::firstOrCreate([
            'store_id' => $store->id,
            'opening_balance' => 1000
        ]);

        // Create an employee shift for the cashier
        EmployeeShift::create([
            'user_id' => $cashier->id,
            'store_id' => $store->id, // ✅ Ensure shift is linked to correct store
            'cash_drawer_id' => $cashDrawer->id,
            'clock_in' => now(),
            'clock_out' => null,
            'total_sales' => 0
        ]);

        echo "✅ Employee Shift Seeded Successfully!\n";
    }
}
