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
        Schema::table('discounts', function (Blueprint $table) {
            // Modify existing columns if needed
            $table->decimal('discount_value', 10, 2)->change();
            $table->enum('discount_type', ['fixed', 'percentage'])->change();
            $table->dateTime('valid_until')->nullable()->change();

            // New fields for discount application
            $table->enum('applies_to', ['all', 'category', 'product', 'customer', 'min_purchase'])
                ->default('all')
                ->after('discount_type');

            $table->foreignId('category_id')->nullable()->constrained('categories')->onDelete('cascade')->after('applies_to');
            $table->foreignId('product_id')->nullable()->constrained('products')->onDelete('cascade')->after('category_id');
            $table->foreignId('customer_id')->nullable()->constrained('customers')->onDelete('cascade')->after('product_id');

            $table->decimal('min_purchase_amount', 10, 2)->nullable()->after('customer_id');

            // Add soft delete support

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('discounts', function (Blueprint $table) {
            $table->dropColumn('applies_to');
            $table->dropColumn('category_id');
            $table->dropColumn('product_id');
            $table->dropColumn('customer_id');
            $table->dropColumn('min_purchase_amount');
        });
    }
};
