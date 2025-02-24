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
        Schema::create('sales', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Cashier
            $table->foreignId('store_id')->nullable()->constrained()->onDelete('set null'); // Multi-store support
            $table->decimal('total_amount', 10, 2);
            $table->enum('payment_method', ['cash', 'credit_card', 'digital_wallet']);
            $table->enum('status', ['pending', 'completed', 'refunded'])->default('pending');
            $table->foreignId('customer_id')->nullable()->constrained('customers')->onDelete('set null');
            $table->foreignId('cash_drawer_id')->nullable()->constrained()->onDelete('set null'); // Tracks shift-based sales
            $table->timestamps();
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sales');
    }
};
