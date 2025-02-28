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
        Schema::create('booking_campaigns', function (Blueprint $table) {
            $table->id();
            $table->string('name', 50);
            $table->string('code')->unique()->index();
            $table->text('note');
            $table->double('discount_percentage', 15, 4)->default(0);
            $table->date('start_date');
            $table->date('end_date');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('booking_campaigns');
    }
};
