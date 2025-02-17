<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\StockMovement;

class StockMovementsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        StockMovement::create([
            'product_id' => 1,
            'type' => 'restock',
            'quantity' => 10,
            'reason' => 'Initial stock'
        ]);

        StockMovement::create([
            'product_id' => 2,
            'type' => 'sale',
            'quantity' => 1,
            'reason' => 'Customer purchase'
        ]);
    }
}
