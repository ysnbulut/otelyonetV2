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
        Schema::create('banks', function (Blueprint $table) {
            $table->id();
            $table->string('name', 75);
            $table->enum('type', ['case', 'bank'])->default('case');
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
        Schema::dropIfExists('banks');
    }
};
