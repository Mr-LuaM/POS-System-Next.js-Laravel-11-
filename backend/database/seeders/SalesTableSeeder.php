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
            'user_id' => 1, // Admin User
            'total_amount' => 1200.00,
            'payment_method' => 'credit_card',
            'customer_id' => 1, // John Doe
        ]);
    }
}
