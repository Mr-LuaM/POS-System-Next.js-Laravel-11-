<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

        $this->call([
            UsersTableSeeder::class,
            CategoriesTableSeeder::class,
            SuppliersTableSeeder::class,
            StoresTableSeeder::class,
            ProductsTableSeeder::class,
            CustomersTableSeeder::class,
            CashDrawersTableSeeder::class,
            EmployeeShiftsTableSeeder::class,

            SalesTableSeeder::class,
            StockMovementsTableSeeder::class,
            DiscountsTableSeeder::class,

        ]);
    }
}
