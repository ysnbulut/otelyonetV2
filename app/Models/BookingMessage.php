<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class BookingMessage extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'booking_id',
        'message',
        'is_reminder',
        'reminder_date',
        'is_read',
    ];
}
