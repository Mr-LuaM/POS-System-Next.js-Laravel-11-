<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('stock_movements', function (Blueprint $table) {
            // 🔹 Drop the old `product_id`
            $table->dropForeign(['product_id']);
            $table->dropColumn('product_id');

            // 🔹 Add `store_product_id` to directly link stock movements to store products
            $table->foreignId('store_product_id')
                ->constrained('store_products')
                ->onDelete('cascade')
                ->after('id');
        });
    }

    public function down(): void
    {
        Schema::table('stock_movements', function (Blueprint $table) {
            $table->dropForeign(['store_product_id']);
            $table->dropColumn('store_product_id');
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
        });
    }
};
