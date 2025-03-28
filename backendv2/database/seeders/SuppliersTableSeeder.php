<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Supplier;

class SuppliersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Supplier::create([
            'name' => 'Tech Supplier Inc.',
            'contact' => '123-456-7890',
            'email' => 'techsupplier@example.com',
            'address' => '123 Tech Street, City'
        ]);

        Supplier::create([
            'name' => 'Food Mart Wholesale',
            'contact' => '987-654-3210',
            'email' => 'foodmart@example.com',
            'address' => '456 Food Street, City'
        ]);
    }
}
