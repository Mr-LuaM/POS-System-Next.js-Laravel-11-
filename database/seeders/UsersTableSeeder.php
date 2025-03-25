<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Store;
use Illuminate\Support\Facades\Hash;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ensure at least one store exists
        $store = Store::firstOrCreate([
            'name' => 'Main Store',
            'location' => '123 POS Street'
        ]);

        // Create Admin (No Store Assigned)
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@pos.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'store_id' => null // Admin does not belong to a store
        ]);

        // Create Manager
        $manager = User::create([
            'name' => 'Manager User',
            'email' => 'manager@pos.com',
            'password' => Hash::make('password'),
            'role' => 'manager',
            'store_id' => $store->id // Assign Manager to Main Store
        ]);

        // Create Cashier
        $cashier = User::create([
            'name' => 'Cashier User',
            'email' => 'cashier@pos.com',
            'password' => Hash::make('password'),
            'role' => 'cashier',
            'store_id' => $store->id // Assign Cashier to Main Store
        ]);

        echo "✅ Users Seeded Successfully!\n";
    }
}
