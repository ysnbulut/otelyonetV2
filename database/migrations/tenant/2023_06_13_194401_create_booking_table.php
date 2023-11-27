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
		Schema::create('bookings', function (Blueprint $table) {
			$table->id();
			$table
				->foreignId('customer_id')
				->constrained('customers')
				->onDelete('cascade');
			$table->date('check_in');
			$table->date('check_out')->nullable();
			$table->timestamps();
			$table->softDeletes();
		});
	}

	// *USD/TRY	1	ABD DOLARI
	// *AUD/TRY	1	AVUSTRALYA DOLARI
	// *DKK/TRY	1	DANİMARKA KRONU
	// *EUR/TRY	1	EURO
	// *GBP/TRY	1	İNGİLİZ STERLİNİ
	// *CHF/TRY	1	İSVİÇRE FRANGI
	// *SEK/TRY	1	İSVEÇ KRONU
	// *CAD/TRY	1	KANADA DOLARI
	// *KWD/TRY	1	KUVEYT DİNARI
	// NOK/TRY	1	NORVEÇ KRONU
	// *SAR/TRY	1	SUUDİ ARABİSTAN RİYALİ
	// *JPY/TRY	100	JAPON YENİ

	/**
	 * Reverse the migrations.
	 */
	public function down(): void
	{
		Schema::dropIfExists('bookings');
	}
};
