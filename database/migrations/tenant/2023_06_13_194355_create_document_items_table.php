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
        Schema::create('document_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('document_id')
                ->constrained()
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table->foreignId('item_id')
                ->nullable()
                ->constrained()
                ->onUpdate('cascade')
                ->onDelete('set null');
            $table->string('name');
            $table->string('description')->nullable();
            $table->string('sku', 25)->nullable();
            $table->double('quantity');
            $table->double('price', 15, 4);
            $table->string('tax_name', 75);
            $table->double('tax_rate', 15, 4);
            $table->double('tax', 15, 4);
            $table->double('total', 15, 4);
            $table->double('discount', 15, 4);
            $table->double('grand_total', 15, 4);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('document_items');
    }
};
