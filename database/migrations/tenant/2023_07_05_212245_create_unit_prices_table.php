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
        Schema::create('unit_prices', static function (Blueprint $table) {
            $table->id();
            $table->foreignId('type_has_view_id')
                ->constrained('type_has_views')
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table->foreignId('season_id')
                ->nullable()
                ->default(null)
                ->constrained()
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table->foreignId('booking_channel_id')
                ->nullable()
                ->default(null)
                ->constrained()
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table->double('unit_price', 15, 4);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('unit_prices');
    }
};
