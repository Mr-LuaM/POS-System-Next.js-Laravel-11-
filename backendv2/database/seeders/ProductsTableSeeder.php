<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Store;
use App\Models\StoreProduct;

class ProductsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // ✅ Create Products (Global)
        $laptop = Product::create([
            'name' => 'Laptop',
            'sku' => 'LAP123',
            'barcode' => '1234567890123',
            'qr_code' => 'laptop-qr',
            'category_id' => 1,
            'supplier_id' => 1
        ]);

        $smartphone = Product::create([
            'name' => 'Smartphone',
            'sku' => 'SMP456',
            'barcode' => '7894561230123',
            'qr_code' => 'smartphone-qr',
            'category_id' => 1,
            'supplier_id' => 1
        ]);

        // ✅ Get all stores and assign different pricing per store
        $stores = Store::all();

        foreach ($stores as $store) {
            StoreProduct::create([
                'store_id' => $store->id,
                'product_id' => $laptop->id,
                'price' => rand(1000, 1500), // Different price per store
                'stock_quantity' => rand(10, 30), // Random stock
                'low_stock_threshold' => 5
            ]);

            StoreProduct::create([
                'store_id' => $store->id,
                'product_id' => $smartphone->id,
                'price' => rand(700, 1000),
                'stock_quantity' => rand(20, 50),
                'low_stock_threshold' => 10
            ]);
        }
    }
}
