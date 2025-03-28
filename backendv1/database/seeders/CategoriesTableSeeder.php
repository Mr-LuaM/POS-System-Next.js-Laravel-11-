<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;

class CategoriesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = ['Electronics', 'Groceries', 'Clothing', 'Furniture', 'Health & Beauty'];

        foreach ($categories as $category) {
            Category::create(['name' => $category]);
        }
    }
}
