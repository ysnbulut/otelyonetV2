<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('c_m_transactions', function (Blueprint $table) {
            $table->unsignedBigInteger('id')->unique();
            $table->morphs('transactionable');
            $table->string('status');
            $table->json('errors');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('c_m_transactions');
    }
};
