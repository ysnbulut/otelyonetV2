<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\BookingNote
 *
 * @method static \Illuminate\Database\Eloquent\Builder|BookingNote newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|BookingNote newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|BookingNote onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|BookingNote query()
 * @method static \Illuminate\Database\Eloquent\Builder|BookingNote withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|BookingNote withoutTrashed()
 * @mixin \Eloquent
 */
class BookingNote extends Model
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
