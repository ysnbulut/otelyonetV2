<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\RoomType
 *
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\BedType> $beds
 * @property-read int|null $beds_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\BedType> $bedsWithCount
 * @property-read int|null $beds_with_count_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\RoomTypeFeature> $features
 * @property-read int|null $features_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Room> $rooms
 * @property-read int|null $rooms_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\TypeHasView> $typeHasViews
 * @property-read int|null $type_has_views_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\UnitPriceRoomTypeAndView> $unitPrices
 * @property-read int|null $unit_prices_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\VariationMultiplier> $variationMultipliers
 * @property-read int|null $variation_multipliers_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\VariationsOfGuestsRoomType> $variationsOfGuests
 * @property-read int|null $variations_of_guests_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\RoomView> $views
 * @property-read int|null $views_count
 * @method static \Illuminate\Database\Eloquent\Builder|RoomType newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|RoomType newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|RoomType onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|RoomType query()
 * @method static \Illuminate\Database\Eloquent\Builder|RoomType withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|RoomType withoutTrashed()
 * @mixin \Eloquent
 */
class RoomType extends Model
{
 use SoftDeletes;


	protected $fillable = ['name', 'description', 'size', 'adult_capacity', 'child_capacity', 'room_count'];

 public function rooms()
 {
  return $this->hasManyThrough(Room::class, TypeHasView::class, 'type_id', 'type_has_view_id', 'id', 'type_id');
 }

	public function beds()
	{
		return $this->belongsToMany(BedType::class, 'type_has_beds', 'type_id', 'bed_type_id')->withPivot('count');
	}
 public function bedsWithCount()
 {
  return $this->belongsToMany(BedType::class, 'type_has_beds', 'type_id', 'bed_type_id')->withPivot('count');
 }

 public function views()
 {
  return $this->belongsToMany(RoomView::class, 'type_has_views', 'type_id', 'view_id');
 }

 public function typeHasViews()
 {
  return $this->hasMany(TypeHasView::class, 'type_id', 'id');
 }

 public function features()
 {
  return $this->belongsToMany(RoomTypeFeature::class, 'type_has_features', 'type_id', 'feature_id');
 }

 public function unitPrices()
 {
  return $this->hasManyThrough(
   UnitPriceRoomTypeAndView::class,
   TypeHasView::class,
   'type_id',
   'type_has_view_id',
   'id',
   'id'
  );
 }

 public function variationsOfGuests()
 {
  return $this->hasMany(VariationsOfGuestsRoomType::class, 'room_type_id', 'id');
 }

 public function variationMultipliers()
 {
  return $this->hasMany(VariationMultiplier::class, 'room_type_id', 'id');
 }
}
