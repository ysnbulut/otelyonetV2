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
  Schema::create('variation_multipliers', function (Blueprint $table) {
   $table->id();
   $table->foreignId('room_type_id')->cascadeOnDelete();
   $table
    ->foreignId('variation_id')
    ->constrained('variations_of_guests_room_types')
    ->cascadeOnDelete();
   $table->double('multiplier');
   $table->timestamps();
   $table->softDeletes();
  });
 }

 /**
  * Reverse the migrations.
  */
 public function down(): void
 {
  Schema::dropIfExists('variation_multipliers');
 }
};
