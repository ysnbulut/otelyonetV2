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
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->enum('type', ['individual', 'company'])->default('individual');
            $table->string('title', 150);
            $table->string('tax_office', 50)->nullable();
            $table->string('tax_number', 25);
            $table->string('email',75)->nullable();
            $table->string('phone', 25)->nullable();
            $table->string('country',50)->nullable();
            $table->string('city',50)->nullable();
            $table->text('address')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};
