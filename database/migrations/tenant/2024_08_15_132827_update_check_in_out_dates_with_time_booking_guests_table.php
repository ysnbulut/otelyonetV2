<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('out_dates_with_time_booking_guests', function (Blueprint $table) {
           //
        });
    }

    public function down(): void
    {
        Schema::table('out_dates_with_time_booking_guests', function (Blueprint $table) {
            //
        });
    }
};
