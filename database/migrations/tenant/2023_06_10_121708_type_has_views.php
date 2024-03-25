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
        Schema::create('type_has_views', function (Blueprint $table) {
            $table->id();
            $table
                ->foreignId('type_id')
                ->constrained('room_types')
                ->onDelete('cascade');
            $table
                ->foreignId('view_id')
                ->constrained('room_views')
                ->onDelete('cascade');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('type_has_views');
    }
};
