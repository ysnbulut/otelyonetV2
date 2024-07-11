<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use ShiftOneLabs\LaravelCascadeDeletes\CascadesDeletes;


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
 * @property-read Booking|null $booking
 * @property-read Collection<int, BookingGuests> $booking_guests
 * @property-read int|null $booking_guests_count
 * @property-read int|null $expenses_count
 * @property-read Collection<int, Guest> $guests
 * @property-read int|null $guests_count
 * @property-read Room|null $room
 * @property-read Collection<int, BookingDailyPrice> $prices
 * @property-read int|null $prices_count
 * @property-read Collection<int, BookingRoomTask> $tasks
 * @property-read int|null $tasks_count
 * @property mixed $check_in
 * @property mixed $check_out
 * @property-read ReasonForCancellation|null $cancelReason
 * @property-read Document|null $document
 * @mixin Eloquent
 */
class BookingRoom extends Model
{
    use SoftDeletes, CascadesDeletes;

    protected $fillable = [
        'booking_id',
        'room_id',
        'check_in',
        'check_out',
        'number_of_adults',
        'number_of_children',
        'children_ages'
    ];

    protected $casts = [
        'children_ages' => 'json',
    ];

    protected $cascadeDeletes = ['documents', 'tasks', 'booking_guests', 'prices', 'cancelReason'];

    public function booking() : HasOne
    {
        return $this->hasOne(Booking::class, 'id', 'booking_id');
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
        return $this->belongsToMany(Guest::class, 'booking_guests', 'booking_room_id', 'guest_id')->withPivot('check_in', 'check_out', 'status', 'check_in_date', 'check_out_date', 'check_in_kbs', 'check_out_kbs');
    }

    public function cancelReason(): HasOne
    {
        return $this->hasOne(ReasonForCancellation::class, 'booking_room_id');
    }

    public function cmTransaction(): morphMany
    {
        return $this->morphMany(CMTransaction::class, 'transactionable');
    }
}
