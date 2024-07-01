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
		Schema::create('type_has_features', function (Blueprint $table) {
			$table->id();
			$table
				->foreignId('type_id')
				->constrained('room_types')
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table->integer('order_no');
			$table
				->foreignId('feature_id')
				->constrained('room_type_features')
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table->timestamps();
		});
	}

	/**
	 * Reverse the migrations.
	 */
	public function down(): void
	{
		Schema::dropIfExists('type_has_features');
	}
};
