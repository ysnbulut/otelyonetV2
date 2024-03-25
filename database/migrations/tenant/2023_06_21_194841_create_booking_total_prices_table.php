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
        Schema::create('booking_total_prices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->constrained();
            $table->double('price');
            $table->foreignId('booking_campaign_id')->nullable()->constrained();
            $table->double('discount')->default(0);
            $table->double('total_price')->default(0);
            $table->double('tax')->default(0);
            $table->double('grand_total');
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
        Schema::dropIfExists('booking_total_prices');
    }
};
