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
   $table->foreignId('building_id')
       ->constrained('buildings')
       ->onUpdate('cascade')
       ->onDelete('cascade');
   $table->foreignId('floor_id')
       ->constrained('floors')
       ->onUpdate('cascade')
       ->onDelete('cascade');
   $table->foreignId('type_has_view_id')
       ->constrained('type_has_views')
       ->onUpdate('cascade')
       ->onDelete('cascade');
   $table->string('name', 50)->unique();
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
