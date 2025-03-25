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
        Schema::create('store_products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained()->onDelete('cascade'); // 🔗 Store reference
            $table->foreignId('product_id')->constrained()->onDelete('cascade'); // 🔗 Product reference
            $table->decimal('price', 10, 2); // 💰 Store-specific price
            $table->integer('stock_quantity')->default(0); // 📦 Store-specific stock
            $table->integer('low_stock_threshold')->default(5); // ⚠️ Store-specific low-stock alert
            $table->softDeletes(); // 🗑 Allows store to "hide" products
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('store_products');
    }
};
