<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Discount;

class DiscountsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Discount::create([
            'code' => 'BLACKFRIDAY',
            'discount_value' => 20.00,
            'discount_type' => 'percentage',
            'valid_until' => now()->addDays(30),
        ]);

        Discount::create([
            'code' => 'WELCOME10',
            'discount_value' => 10.00,
            'discount_type' => 'fixed',
            'valid_until' => now()->addMonths(1),
        ]);
    }
}
