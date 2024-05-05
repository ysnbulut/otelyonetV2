<?php

use App\Models\Tenant;
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
        Schema::create('hotels', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Tenant::class);
            $table->enum('status', ['active', 'suspend', 'closed'])->default('active');
            $table->string('name');
            $table->date('register_date');
            $table->date('renew_date');
            $table->double('price');
            $table->double('renew_price');
            $table->string('title')->nullable();
            $table->text('address')->nullable();
            $table->foreignId('province_id')->nullable()->constrained();
            $table->foreignId('district_id')->nullable()->constrained();
            $table->string('location')->nullable();
            $table->foreignId('tax_office_id')->nullable()->constrained();
            $table->string('tax_number')->nullable();
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hotels');
    }
};
