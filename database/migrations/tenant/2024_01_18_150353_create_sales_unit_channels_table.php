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
        Schema::create('sales_unit_channels', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sales_unit_id')->constrained('sales_units');
            $table->foreignId('sales_channel_id')->constrained('sales_channels');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sales_unit_channels');
    }
};
