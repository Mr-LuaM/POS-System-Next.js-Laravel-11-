<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Product::create([
            'name' => 'Apple iPhone 14',
            'sku' => 'IP14-001',
            'price' => 999.99,
            'stock_quantity' => 50,
            'category' => 'Electronics',
        ]);

        Product::create([
            'name' => 'Samsung Galaxy S23',
            'sku' => 'SGS23-002',
            'price' => 899.99,
            'stock_quantity' => 40,
            'category' => 'Electronics',
        ]);
    }
}
