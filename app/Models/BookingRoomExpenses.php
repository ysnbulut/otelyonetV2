<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class BookingRoomExpenses extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'booking_room_id',
        'expense_type',
        'name',
        'quantity',
        'price',
        'tax',
        'total',
        'description',
    ];
}
