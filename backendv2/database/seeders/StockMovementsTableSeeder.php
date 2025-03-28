<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\StockMovement;
use App\Models\StoreProduct;

class StockMovementsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 🔍 Find store products (Make sure they exist before seeding)
        $storeProduct1 = StoreProduct::where('product_id', 1)->first();
        $storeProduct2 = StoreProduct::where('product_id', 2)->first();

        if (!$storeProduct1 || !$storeProduct2) {
            echo "⚠️ Cannot seed stock movements: Store Products not found. Run 'php artisan db:seed --class=StoreProductsTableSeeder' first.\n";
            return;
        }

        // ✅ Insert stock movements with `store_product_id`
        StockMovement::create([
            'store_product_id' => $storeProduct1->id,
            'type' => 'restock',
            'quantity' => 10,
            'reason' => 'Initial stock'
        ]);

        StockMovement::create([
            'store_product_id' => $storeProduct2->id,
            'type' => 'sale',
            'quantity' => 1,
            'reason' => 'Customer purchase'
        ]);

        echo "✅ Stock Movements seeded successfully.\n";
    }
}
