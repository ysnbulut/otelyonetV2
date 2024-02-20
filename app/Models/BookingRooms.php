<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\BookingRooms
 *
 * @method static Builder|BookingRooms newModelQuery()
 * @method static Builder|BookingRooms newQuery()
 * @method static Builder|BookingRooms onlyTrashed()
 * @method static Builder|BookingRooms query()
 * @method static Builder|BookingRooms withTrashed()
 * @method static Builder|BookingRooms withoutTrashed()
 * @mixin Eloquent
 */
class BookingRooms extends Model
{
	protected $fillable = ['booking_id', 'room_id', 'check_in'];
	use SoftDeletes;

    public function booking(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }

    public function room(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Room::class);
    }

    public function guests(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(Guest::class, 'booking_guests', 'booking_room_id', 'guest_id');
    }
}
