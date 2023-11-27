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
  Schema::create('unit_price_room_type_and_views', function (Blueprint $table) {
   $table->id();
   $table
    ->foreignId('type_has_view_id')
    ->constrained('type_has_views')
    ->cascadeOnDelete();
   $table
    ->foreignId('season_id')
    ->nullable()
    ->default(null)
    ->constrained()
    ->cascadeOnDelete();
   $table->double('unit_price');
   $table->timestamps();
   $table->softDeletes();
  });
 }

 /**
  * Reverse the migrations.
  */
 public function down(): void
 {
  Schema::dropIfExists('unit_price_room_type_and_views');
 }
};
