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
  Schema::create('booking_payments', function (Blueprint $table) {
   $table->id();
   $table->foreignId('customer_id')->constrained();
   $table
    ->foreignId('booking_id')
    ->nullable()
    ->constrained();
   $table->foreignId('case_and_bank_id')->constrained();
	 $table->date('payment_date');
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
   $table->double('currency_amount');
   $table->double('amount_paid');
   $table->enum('payment_method', ['cash', 'credit_card', 'bank_transfer'])->default('cash');
	 $table->string('description')->nullable();
   $table->timestamps();
   $table->softDeletes();
  });
 }

 /**
  * Reverse the migrations.
  */
 public function down(): void
 {
  Schema::dropIfExists('booking_payments');
 }
};
