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
		Schema::create('booking_guests', function (Blueprint $table) {
			$table->id();
			$table->foreignId('booking_room_id')->constrained();
			$table->foreignId('guest_id')->constrained();
            $table->boolean('check_in')->default(false);
            $table->boolean('check_out')->default(false);
            $table->enum('status', ['pending', 'not_coming', 'check_in', 'check_out'])->default('pending');
            $table->date('check_in_date')->nullable();
            $table->date('check_out_date')->nullable();
            $table->boolean('check_in_kbs')->default(false);
            $table->boolean('check_out_kbs')->default(false);
			$table->timestamps();
			$table->softDeletes();
		});
	}

	/**
	 * Reverse the migrations.
	 */
	public function down(): void
	{
		Schema::dropIfExists('booking_guests');
	}
};
