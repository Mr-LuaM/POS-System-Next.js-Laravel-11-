<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Store;

class StoresTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Store::create([
            'name' => 'Main Store',
            'location' => 'Downtown'
        ]);

        Store::create([
            'name' => 'Branch 1',
            'location' => 'Suburb'
        ]);
    }
}
