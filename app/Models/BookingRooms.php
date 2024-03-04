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
    use SoftDeletes;
    protected $fillable = [
        'booking_id',
        'room_id',
        'number_of_adults',
        'number_of_children',
        'children_ages'
    ];

    public function booking(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }

    public function room(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Room::class);
    }

    public function booking_guests(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(BookingGuests::class, 'booking_room_id');
    }

    public function guests(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(Guest::class, 'booking_guests', 'booking_room_id', 'guest_id')->withPivot('check_in', 'check_out', 'status', 'check_in_date', 'check_out_date', 'check_in_kbs',  'check_out_kbs');
    }

    public function expenses(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(BookingRoomExpenses::class, 'booking_room_id');
    }
}
