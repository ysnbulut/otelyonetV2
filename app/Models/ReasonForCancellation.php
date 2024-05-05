<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\ReasonForCancellation
 *
 * @property-read \App\Models\Booking|null $booking
 * @property-read \App\Models\BookingRoom|null $bookingRoom
 * @method static \Illuminate\Database\Eloquent\Builder|ReasonForCancellation newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ReasonForCancellation newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ReasonForCancellation onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|ReasonForCancellation query()
 * @method static \Illuminate\Database\Eloquent\Builder|ReasonForCancellation withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|ReasonForCancellation withoutTrashed()
 * @mixin \Eloquent
 */
class ReasonForCancellation extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'booking_id',
        'booking_room_id',
        'reason',
    ];

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }

    public function bookingRoom()
    {
        return $this->belongsTo(BookingRoom::class);
    }
}
