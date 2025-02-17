<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Store;

class ProductsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $store = Store::first();
        Product::create([
            'name' => 'Laptop',
            'sku' => 'LAP123',
            'barcode' => '1234567890123',
            'qr_code' => 'laptop-qr',
            'price' => 1200.00,
            'stock_quantity' => 20,
            'low_stock_threshold' => 5,
            'category_id' => 1,
            'supplier_id' => 1,
            'store_id' => $store ? $store->id : null // ✅ Avoids foreign key error
        ]);

        Product::create([
            'name' => 'Smartphone',
            'sku' => 'SMP456',
            'barcode' => '7894561230123',
            'qr_code' => 'smartphone-qr',
            'price' => 800.00,
            'stock_quantity' => 50,
            'low_stock_threshold' => 10,
            'category_id' => 1,
            'supplier_id' => 1,
            'store_id' => $store ? $store->id : null // ✅ Avoids foreign key error
        ]);
    }
}
