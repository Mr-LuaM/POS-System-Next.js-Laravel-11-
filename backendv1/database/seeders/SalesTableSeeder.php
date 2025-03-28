<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Sale;

class SalesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Sale::create([
            'user_id' => 2, // Cashier ID
            'store_id' => 1,
            'customer_id' => 1,
            'total_amount' => 150.00,
            'payment_method' => 'cash',
            'status' => 'completed',
            'cash_drawer_id' => 1
        ]);
    }
}
