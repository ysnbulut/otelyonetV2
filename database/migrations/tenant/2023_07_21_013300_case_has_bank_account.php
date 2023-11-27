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
  Schema::create('case_has_bank_account', function (Blueprint $table) {
   $table->id();
   $table->foreignId('case_and_banks_id')->constrained();
   $table->foreignId('bank_account_information_id')->constrained('bank_account_information');
   $table->timestamps();
	  $table->softDeletes();
  });
 }

 /**
  * Reverse the migrations.
  */
 public function down(): void
 {
  Schema::dropIfExists('case_has_bank_account');
 }
};
