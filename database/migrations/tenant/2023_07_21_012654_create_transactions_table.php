<?php

use Carbon\Carbon;
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
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')
                ->constrained()
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table->enum('type', ['income', 'expense']);
            $table->foreignId('bank_id')
                ->constrained()
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table->dateTime('paid_at')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->string('description')->nullable();
            $table->double('amount', 15, 4);
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
            $table->double('currency_rate', 15, 4);
            $table->enum('payment_method', ['cash', 'credit_card', 'virtual_pos', 'bank_transfer']);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
