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
		Schema::create('booking_rooms', function (Blueprint $table) {
			$table->id();
			$table->foreignId('booking_id')
                ->constrained()
                ->onUpdate('cascade')
                ->onDelete('cascade');
			$table->foreignId('room_id')
                ->constrained()
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table->dateTime('check_in');
            $table->dateTime('check_out');
            $table->integer('number_of_adults')->default(1);
            $table->integer('number_of_children')->default(0);
            $table->json('children_ages')->nullable();
			$table->timestamps();
			$table->softDeletes();
		});
	}

	/**
	 * Reverse the migrations.
	 */
	public function down(): void
	{
		Schema::dropIfExists('booking_rooms');
	}
};
