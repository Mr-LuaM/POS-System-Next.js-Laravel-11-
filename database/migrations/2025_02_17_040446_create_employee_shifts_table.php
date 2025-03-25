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
        Schema::create('employee_shifts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Employee ID
            $table->foreignId('store_id')->nullable()->constrained()->onDelete('cascade'); // Store tracking
            $table->foreignId('cash_drawer_id')->nullable()->constrained()->onDelete('set null'); // Tracks cash register
            $table->timestamp('clock_in');
            $table->timestamp('clock_out')->nullable();
            $table->decimal('total_sales', 10, 2)->default(0); // Tracks sales made during shift
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employee_shifts');
    }
};
