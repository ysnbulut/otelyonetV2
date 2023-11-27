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
  Schema::create('possibilities_multipliers', function (Blueprint $table) {
   $table->id();
   $table->foreignId('room_type_id')->cascadeOnDelete();
   $table
    ->foreignId('possibility_id')
    ->constrained('possibilities_of_guests_room_types')
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
  Schema::dropIfExists('possibilities_multipliers');
 }
};
