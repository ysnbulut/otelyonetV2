<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\BookingRoom
 *
 * @method static Builder|BookingRoom newModelQuery()
 * @method static Builder|BookingRoom newQuery()
 * @method static Builder|BookingRoom onlyTrashed()
 * @method static Builder|BookingRoom query()
 * @method static Builder|BookingRoom withTrashed()
 * @method static Builder|BookingRoom withoutTrashed()
 * @property mixed $id
 * @property-read \App\Models\Booking|null $booking
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\BookingGuests> $booking_guests
 * @property-read int|null $booking_guests_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\BookingRoomExpense> $expenses
 * @property-read int|null $expenses_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Guest> $guests
 * @property-read int|null $guests_count
 * @property-read \App\Models\Room|null $room
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\BookingDailyPrice> $prices
 * @property-read int|null $prices_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\BookingRoomTask> $tasks
 * @property-read int|null $tasks_count
 * @property mixed $check_in
 * @property mixed $check_out
 * @property-read \App\Models\ReasonForCancellation|null $cancelReason
 * @property-read Document|null $document
 * @mixin Eloquent
 */
class BookingRoom extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'booking_id',
        'room_id',
        'check_in',
        'check_out',
        'number_of_adults',
        'number_of_children',
        'children_ages'
    ];

    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }

    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }

    public function documents(): morphMany
    {
        return $this->morphMany(Document::class, 'unit');
    }

    public function prices(): HasMany
    {
        return $this->hasMany(BookingDailyPrice::class, 'booking_room_id');
    }

    public function tasks(): morphMany
    {
        return $this->morphMany(Task::class, 'taskable');
    }

    public function booking_guests(): HasMany
    {
        return $this->hasMany(BookingGuests::class, 'booking_room_id');
    }

    public function guests(): BelongsToMany
    {
        return $this->belongsToMany(Guest::class, 'booking_guests', 'booking_room_id', 'guest_id')->withPivot('check_in', 'check_out', 'status', 'check_in_date', 'check_out_date', 'check_in_kbs',  'check_out_kbs');
    }

    public function cancelReason(): HasOne
    {
        return $this->hasOne(ReasonForCancellation::class, 'booking_room_id');
    }
}
