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
        Schema::create('booking_daily_prices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_total_price_id')->constrained();
            $table->foreignId('booking_room_id')->constrained();
            $table->date('date');
            $table->double('original_price');
            $table->double('discount')->default(0);
            $table->double('price');
            $table->enum('currency', [
                'TRY',
                'USD',
                'EUR',
                'GBP',
                'SAR',
                'AUD',
                'CHF',
                'CAD',
                'KWD',
                'JPY',
                'DKK',
                'SEK',
                'NOK',
            ]);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('booking_daily_prices');
    }
};
