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
		Schema::create('type_has_beds', function (Blueprint $table) {
			$table->id();
			$table
				->foreignId('type_id')
				->constrained('room_types')
				->onDelete('cascade');
			$table
				->foreignId('bed_type_id')
				->constrained('bed_types')
				->onDelete('cascade');
			$table->integer('count')->default(1);
			$table->timestamps();
			$table->softDeletes();
		});
	}

	/**
	 * Reverse the migrations.
	 */
	public function down(): void
	{
		Schema::dropIfExists('type_has_beds');
	}
};
