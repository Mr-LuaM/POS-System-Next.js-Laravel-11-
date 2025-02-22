<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('customers', function (Blueprint $table) {
            $table->string('barcode')->unique()->nullable()->after('phone'); // ✅ Add Barcode
            $table->string('qr_code')->unique()->nullable()->after('barcode'); // ✅ Add QR Code
            $table->string('address')->nullable()->after('qr_code'); // ✅ Add Address
            $table->string('city')->nullable()->after('address'); // ✅ Add City
            $table->string('state')->nullable()->after('city'); // ✅ Add State
            $table->string('zip_code')->nullable()->after('state'); // ✅ Add Zip Code
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('customers', function (Blueprint $table) {
            $table->dropColumn(['barcode', 'qr_code', 'address', 'city', 'state', 'zip_code']); // ✅ Rollback Changes
        });
    }
};
