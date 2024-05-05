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
            $table->foreignId('booking_room_id')
                ->constrained()
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table->date('date');
            $table->double('original_price', 15, 4);
            $table->double('discount', 15, 4)->default(0);
            $table->double('price', 15, 4);
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
