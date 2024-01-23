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
        Schema::create('unit_channel_service_prices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sales_unit_channels_id')->constrained('sales_unit_channels');
            $table->foreignId('sales_unit_service_id')->constrained('sales_unit_services');
            $table->decimal('price', 10, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('unit_channel_service_prices');
    }
};
