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
		Schema::create('guests', function (Blueprint $table) {
			$table->id();
			$table->string('name', 100);
			$table->string('surname', 100);
			$table->string('nationality', 50);
			$table->string('identification_number', 25);
			$table->string('phone', 25)->nullable();
			$table->string('email', 100)->nullable();
			$table->enum('gender', ['male', 'female', 'unspecified'])->default('unspecified');
			$table->timestamps();
			$table->softDeletes();
		});
	}

	/**
	 * Reverse the migrations.
	 */
	public function down(): void
	{
		Schema::dropIfExists('guests');
	}
};
