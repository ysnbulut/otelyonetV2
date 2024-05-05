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
			$table->string('name', 50);
			$table->string('surname', 50);
            $table->boolean('is_foreign_national')->default(false);
			$table->foreignId('citizen_id')
                ->nullable()
                ->constrained('citizens')
                ->onUpdate('cascade')
                ->onDelete('set null');
			$table->string('identification_number', 25);
            $table->date('birthday');
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
