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
        Schema::create('bank_account_information', function (Blueprint $table) {
            $table->id();
            $table->foreignId('bank_id')
                ->constrained('banks')
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table->string('iban', 50)->unique();
            $table->string('swift_code', 50);
            $table->string('bank_name', 75);
            $table->string('branch_name', 75);
            $table->string('branch_code', 50);
            $table->string('account_number', 50);
            $table->string('account_name', 75);
            $table->enum('account_currency', ['TRY', 'USD', 'EUR', 'GBP', 'SAR', 'AUD', 'CHF', 'CAD', 'KWD', 'JPY', 'DKK', 'SEK', 'NOK']);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bank_account_information');
    }
};
