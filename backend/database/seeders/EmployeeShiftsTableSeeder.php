<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\EmployeeShift;

class EmployeeShiftsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        EmployeeShift::create([
            'user_id' => 2, // Cashier ID
            'store_id' => 1,
            'cash_drawer_id' => 1,
            'clock_in' => now(),
            'clock_out' => null,
            'total_sales' => 0
        ]);
    }
}
