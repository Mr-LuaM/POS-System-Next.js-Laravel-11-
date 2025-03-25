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
        Schema::table('users', function (Blueprint $table) {
            $table->softDeletes(); // ✅ Adds `deleted_at` column
        });
        Schema::table('customers', function (Blueprint $table) {
            $table->softDeletes();
        });
        Schema::table('stores', function (Blueprint $table) {
            $table->softDeletes();
        });
        Schema::table('suppliers', function (Blueprint $table) {
            $table->softDeletes();
        });
        Schema::table('products', function (Blueprint $table) {
            $table->softDeletes();
        });
        Schema::table('categories', function (Blueprint $table) {
            $table->softDeletes();
        });
        Schema::table('sales', function (Blueprint $table) {
            $table->softDeletes();
        });
        Schema::table('sale_items', function (Blueprint $table) {
            $table->softDeletes();
        });
        Schema::table('payments', function (Blueprint $table) {
            $table->softDeletes();
        });
        Schema::table('discounts', function (Blueprint $table) {
            $table->softDeletes();
        });
        Schema::table('loyalty_points', function (Blueprint $table) {
            $table->softDeletes();
        });

        Schema::table('expenses', function (Blueprint $table) {
            $table->softDeletes();
        });
        Schema::table('refunds', function (Blueprint $table) {
            $table->softDeletes();
        });
        Schema::table('stock_movements', function (Blueprint $table) {
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tables', function (Blueprint $table) {
            //
        });
    }
};
