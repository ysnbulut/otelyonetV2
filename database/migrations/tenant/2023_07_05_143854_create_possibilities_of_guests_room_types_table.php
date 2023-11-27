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
  Schema::create('possibilities_of_guests_room_types', function (Blueprint $table) {
   $table->id();
   $table
    ->foreignId('room_type_id')
    ->constrained()
    ->cascadeOnDelete();
   $table->integer('number_of_adults');
   $table->integer('number_of_children')->default(0);
   $table->timestamps();
   $table->softDeletes();
  });
 }

 /**
  * Reverse the migrations.
  */
 public function down(): void
 {
  Schema::dropIfExists('possibilities_of_guests_room_types');
 }
};
