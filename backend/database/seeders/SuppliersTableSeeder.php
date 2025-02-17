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
            'name' => 'Tech Distributors Inc.',
            'contact' => 'Supplier Rep',
            'email' => 'supplier@example.com',
            'address' => '123 Supplier St, Tech City',
        ]);

        Supplier::create([
            'name' => 'Gadget Warehouse',
            'contact' => 'Warehouse Manager',
            'email' => 'warehouse@example.com',
            'address' => '456 Warehouse Ave, Gadget Town',
        ]);
    }
}
