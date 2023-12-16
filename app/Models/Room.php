<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\Room
 *
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Booking> $bookings
 * @property-read int|null $bookings_count
 * @property-read \App\Models\Building|null $building
 * @property-read \App\Models\Floor|null $floor
 * @property-read \App\Models\RoomType|null $roomType
 * @property-read \App\Models\RoomView|null $roomView
 * @property-read \App\Models\TypeHasView|null $typeHasView
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
 use HasFactory, SoftDeletes;

	protected $fillable = [
  'building_id',
  'floor_id',
  'type_has_view_id',
  'name',
  'description',
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
}
