<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
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
 * @method static \Illuminate\Database\Eloquent\Builder|Room newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Room newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Room onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|Room query()
 * @method static \Illuminate\Database\Eloquent\Builder|Room withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|Room withoutTrashed()
 * @mixin \Eloquent
 */
class Room extends Model
{
 use SoftDeletes;

	protected $fillable = [
  'building_id',
  'floor_id',
  'type_has_view_id',
  'name',
//  'description',
  'is_clean',
  'status',
 ];

 public function building()
 {
  return $this->belongsTo(Building::class);
 }

 public function floor()
 {
  return $this->belongsTo(Floor::class);
 }

 public function typeHasView()
 {
	return $this->belongsTo(TypeHasView::class);
 }

 public function roomType()
 {
  return $this->hasOneThrough(RoomType::class, TypeHasView::class, 'id', 'id', 'type_has_view_id', 'type_id');
 }

 public function roomView()
 {
  return $this->hasOneThrough(RoomView::class, TypeHasView::class, 'id', 'id', 'type_has_view_id', 'view_id');
 }

 public function bookings()
 {
  return $this->hasManyThrough(Booking::class, BookingRooms::class, 'room_id', 'id', 'id', 'booking_id');
 }

    /**
     * @param $query
     * @param $searchTerm
     * @return mixed
     */
    public function scopeFilter($query, array $filters)
    {
        $query
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query
                        ->where('name', 'like', '%' . $search . '%');
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
