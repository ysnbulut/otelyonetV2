<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('booking_notes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')
                ->constrained()
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table->text('note');
            $table->boolean('is_reminder')->default(false);
            $table->dateTime('due_date')->nullable();
            $table->boolean('is_read')->default(false);
            $table->boolean('is_done')->default(false);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('booking_notes');
    }
};
