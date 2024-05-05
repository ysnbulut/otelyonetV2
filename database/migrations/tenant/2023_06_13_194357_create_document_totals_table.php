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
        Schema::create('document_totals', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->foreignId('document_id')
                ->constrained()
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table->enum('type', ['subtotal', 'discount', 'tax', 'total']);
            $table->double('amount', 15, 4);
            $table->integer('sort_order')->default(1);
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('document_totals');
    }
};
