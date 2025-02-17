<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@pos.com',
            'password' => Hash::make('password'),
            'role' => 'admin'
        ]);

        User::create([
            'name' => 'Cashier User',
            'email' => 'cashier@pos.com',
            'password' => Hash::make('password'),
            'role' => 'cashier'
        ]);

        User::create([
            'name' => 'Manager User',
            'email' => 'manager@pos.com',
            'password' => Hash::make('password'),
            'role' => 'manager'
        ]);
    }
}
