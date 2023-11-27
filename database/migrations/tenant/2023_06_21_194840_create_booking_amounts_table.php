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
  Schema::create('booking_amounts', function (Blueprint $table) {
   $table->id();
   $table->foreignId('booking_id')->constrained();
   $table->double('price');
   $table->double('campaign')->default(0);
   $table->double('discount')->default(0);
   $table->double('total_price')->default(0);
   $table->double('tax')->default(0);
   $table->double('grand_total');
   $table->timestamps();
   $table->softDeletes();
  });
 }

 /**
  * Reverse the migrations.
  */
 public function down(): void
 {
  Schema::dropIfExists('booking_amounts');
 }
};
