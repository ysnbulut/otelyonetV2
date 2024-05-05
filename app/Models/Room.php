<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\Relations\HasOneThrough;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\Room
 *
 * @property-read Collection<int, Booking> $bookings
 * @property-read int|null $bookings_count
 * @property-read Building|null $building
 * @property-read Floor|null $floor
 * @property-read RoomType|null $roomType
 * @property-read RoomView|null $roomView
 * @property-read TypeHasView|null $typeHasView
 * @property mixed $can_be_checkout
 * @property mixed $pivot
 * @method static Builder|Room newModelQuery()
 * @method static Builder|Room newQuery()
 * @method static Builder|Room onlyTrashed()
 * @method static Builder|Room query()
 * @method static Builder|Room withTrashed()
 * @method static Builder|Room withoutTrashed()
 * @method static Builder|Room filter(array $filters)
 * @property-read Collection<int, \App\Models\BookingRoom> $bookingRooms
 * @property-read int|null $booking_rooms_count
 * @property mixed $room
 * @property mixed $check_in
 * @property mixed $check_out
 * @property mixed $number_of_adults
 * @property mixed $number_of_children
 * @property mixed $children_ages
 * @property mixed $documents
 * @mixin Eloquent
 */
class Room extends Model
{
    use SoftDeletes;

    protected $fillable = ['building_id', 'floor_id', 'type_has_view_id', 'name', //  'description',
        'is_clean', 'status',];

    public function building(): BelongsTo
    {
        return $this->belongsTo(Building::class);
    }

    public function floor(): BelongsTo
    {
        return $this->belongsTo(Floor::class);
    }

    public function typeHasView(): BelongsTo
    {
        return $this->belongsTo(TypeHasView::class);
    }

    public function roomType(): HasOneThrough
    {
        return $this->hasOneThrough(RoomType::class, TypeHasView::class, 'id', 'id', 'type_has_view_id', 'type_id');
    }

    public function roomView(): HasOneThrough
    {
        return $this->hasOneThrough(RoomView::class, TypeHasView::class, 'id', 'id', 'type_has_view_id', 'view_id');
    }

    public function bookingRooms(): HasMany
    {
        return $this->hasMany(BookingRoom::class);
    }

    public function bookings(): HasManyThrough
    {
        return $this->hasManyThrough(Booking::class, BookingRoom::class, 'room_id', 'id', 'id', 'booking_id');
    }

    public function tasks(): MorphMany
    {
        return $this->morphMany(Task::class, 'taskable');
    }

    /**
     * @param $query
     * @param array $filters
     * @return void
     */
    public function scopeFilter($query, array $filters): void
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query->where('name', 'like', '%' . $search . '%');
                });
                $query->orWhereHas('roomType', function ($query) use ($search) {
                    $query->where('name', 'like', '%' . $search . '%');
                });
                $query->orWhereHas('roomView', function ($query) use ($search) {
                    $query->where('name', 'like', '%' . $search . '%');
                });
            });
//            ->when($filters['trashed'] ?? null, function ($query, $trashed) {
//                if ($trashed === 'with') {
//                    $query->withTrashed();
//                } elseif ($trashed === 'only') {
//                    $query->onlyTrashed();
//                }
//            });
    }
}
