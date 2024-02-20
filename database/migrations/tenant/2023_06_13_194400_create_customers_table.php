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
   $table->enum('type', ['individual', 'company'])->default('individual');
   $table->string('title');
    $table->string('tax_office')->nullable();
   $table->string('tax_number');
   $table->string('email')->nullable();
   $table->string('phone')->nullable();
   $table->string('country')->nullable();;
   $table->string('city')->nullable();;
   $table->string('address')->nullable();;
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
