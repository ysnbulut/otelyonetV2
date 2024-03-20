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
        Schema::create('tax_offices', function (Blueprint $table) {
            $table->id();
            $table->integer('province_id');
            $table->string('province');
            $table->string('district');
            $table->string('code');
            $table->string('tax_office');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tax_offices');
    }
};
