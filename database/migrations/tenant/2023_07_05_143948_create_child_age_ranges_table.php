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
  Schema::create('child_age_ranges', function (Blueprint $table) {
   $table->id();
   $table
    ->foreignId('variation_id')
    ->constrained('variations_of_guests_room_types')
    ->cascadeOnDelete();
   $table->integer('min_age');
   $table->integer('max_age');
   $table->timestamps();
   $table->softDeletes();
  });
 }

 /**
  * Reverse the migrations.
  */
 public function down(): void
 {
  Schema::dropIfExists('child_age_ranges');
 }
};
