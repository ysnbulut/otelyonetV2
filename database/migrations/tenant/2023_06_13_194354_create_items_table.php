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
        Schema::create('items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('item_category_id')->constrained();
            $table->string('name', 150);
            $table->string('description')->nullable();
            $table->enum('type', ['product', 'service', 'extras'])->default('product');
            $table->double('price', 15, 4);
            $table->foreignId('tax_id')->constrained();
            $table->double('tax', 15, 4);
            $table->double('total_price', 15, 4);
            $table->integer('preparation_time')->default(0);
            $table->boolean('enabled')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('items');
    }
};
