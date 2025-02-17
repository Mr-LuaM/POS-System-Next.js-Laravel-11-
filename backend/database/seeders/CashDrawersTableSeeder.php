<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\CashDrawer;

class CashDrawersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        CashDrawer::create([
            'store_id' => 1,
            'opening_balance' => 500.00,
            'closing_balance' => null
        ]);
    }
}
