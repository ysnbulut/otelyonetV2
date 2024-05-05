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
		Schema::create('room_types', function (Blueprint $table) {
			$table->id();
			$table->string('name', 50);
			$table->text('description')->nullable();
			$table->integer('size');
			$table->integer('adult_capacity');
			$table->integer('child_capacity');
			$table->integer('room_count');
			$table->timestamps();
			$table->softDeletes();
		});
	}

	/**
	 * Reverse the migrations.
	 */
	public function down(): void
	{
		Schema::dropIfExists('room_types');
	}
};
