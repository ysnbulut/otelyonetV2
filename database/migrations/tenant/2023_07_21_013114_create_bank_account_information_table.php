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
  Schema::create('bank_account_information', function (Blueprint $table) {
   $table->id();
   $table->string('iban');
   $table->string('swift_code');
   $table->string('bank_name');
   $table->string('branch_name');
   $table->string('branch_code');
   $table->string('account_number');
   $table->string('account_name');
   // $table->string('account_type');
   $table->enum('account_currency', ['TRY', 'USD', 'EUR', 'GBP', 'SAR', 'AUD', 'CHF', 'CAD', 'KWD', 'JPY', 'DKK', 'SEK', 'NOK']);
   // $table->string('account_country');
   // $table->string('account_city');
   // $table->string('account_address');
   // $table->string('account_phone');
   // $table->string('account_fax');
   // $table->string('account_email');
   // $table->string('account_contact_person');
   $table->timestamps();
	  $table->softDeletes();
  });
 }

 /**
  * Reverse the migrations.
  */
 public function down(): void
 {
  Schema::dropIfExists('bank_account_information');
 }
};
