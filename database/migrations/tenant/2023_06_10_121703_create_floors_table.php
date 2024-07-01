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
		Schema::create('floors', function (Blueprint $table) {
			$table->id();
			$table
				->foreignId('building_id')
                ->default(1)
				->constrained('buildings')
                ->onUpdate('cascade')
				->onDelete('cascade');
			$table->string('name', 50);
			$table->timestamps();
			$table->softDeletes();
		});
	}

	/**
	 * Reverse the migrations.
	 */
	public function down(): void
	{
		Schema::dropIfExists('floors');
	}
};
