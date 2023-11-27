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
  Schema::create('rooms', function (Blueprint $table) {
   $table->id();
   $table->foreignId('building_id')->constrained('buildings');
   $table->foreignId('floor_id')->constrained('floors');
   $table->foreignId('type_has_view_id')->constrained('type_has_views');
   $table->string('name');
   $table->text('description');
   $table->boolean('is_clean')->default(true);
   $table->boolean('status')->default(true);
   $table->timestamps();
   $table->softDeletes();
  });
 }

 /**
  * Reverse the migrations.
  */
 public function down(): void
 {
  Schema::dropIfExists('rooms');
 }
};
