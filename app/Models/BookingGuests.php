<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\BookingGuests
 *
 * @property-read Booking|null $booking
 * @property-read Guest|null $guest
 * @property mixed $check_in
 * @property mixed $check_out
 * @property mixed $check_in_date
 * @property mixed $status
 * @property mixed $check_out_date
 * @property mixed $check_in_kbs
 * @property mixed $check_out_kbs
 * @method static Builder|BookingGuests newModelQuery()
 * @method static Builder|BookingGuests newQuery()
 * @method static Builder|BookingGuests onlyTrashed()
 * @method static Builder|BookingGuests query()
 * @method static Builder|BookingGuests withTrashed()
 * @method static Builder|BookingGuests withoutTrashed()
 * @property-read \App\Models\BookingRoom|null $booking_room
 * @mixin Eloquent
 */
class BookingGuests extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'booking_room_id',
        'guest_id',
        'check_in',
        'check_out',
        'status',
        'check_in_date',
        'check_out_date',
        'check_in_kbs',
        'check_out_kbs'
    ];

    public function booking_room(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(BookingRoom::class);
    }

    public function booking(): \Illuminate\Database\Eloquent\Relations\hasOneThrough
    {
        return $this->hasOneThrough(Booking::class, BookingRoom::class, 'id', 'id', 'booking_room_id', 'booking_id');
    }

    public function guest(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Guest::class);
    }
}
