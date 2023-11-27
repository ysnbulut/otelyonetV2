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
  Schema::create('customers', function (Blueprint $table) {
   $table->id();
   $table->enum('type', ['individual', 'company']);
   $table->string('title');
   $table->string('tax_number');
   $table->string('email')->nullable();
   $table->string('phone')->nullable();
   $table->string('country');
   $table->string('city');
   $table->string('address');
   $table->timestamps();
   $table->softDeletes();
  });
 }

 /**
  * Reverse the migrations.
  */
 public function down(): void
 {
  Schema::dropIfExists('customers');
 }
};
