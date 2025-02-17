<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Customer;

class CustomersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Customer::create([
            'name' => 'John Doe',
            'email' => 'johndoe@example.com',
            'phone' => '123-456-7890'
        ]);

        Customer::create([
            'name' => 'Jane Smith',
            'email' => 'janesmith@example.com',
            'phone' => '987-654-3210'
        ]);
    }
}
