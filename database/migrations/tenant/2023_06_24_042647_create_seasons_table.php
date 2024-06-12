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
        Schema::create('seasons', static function (Blueprint $table) {
            $table->id();
            $table->string('uid', 20)->unique();
            $table->date('start_date');
            $table->date('end_date');
            $table->string('name', 75);
            $table->string('description')->nullable();
            $table->boolean('channels')->default(false);
            $table->boolean('web')->default(false);
            $table->boolean('agency')->default(false);
            $table->boolean('reception')->default(false);
            $table->json('calendar_colors');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('seasons');
    }
};
