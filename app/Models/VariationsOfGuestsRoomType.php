<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\VariationsOfGuestsRoomType
 *
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\ChildAgeRanges> $childAgeRanges
 * @property-read int|null $child_age_ranges_count
 * @property-read \App\Models\VariationMultiplier|null $multiplier
 * @property-read \App\Models\RoomType|null $roomType
 * @method static \Illuminate\Database\Eloquent\Builder|VariationsOfGuestsRoomType newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|VariationsOfGuestsRoomType newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|VariationsOfGuestsRoomType onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|VariationsOfGuestsRoomType query()
 * @method static \Illuminate\Database\Eloquent\Builder|VariationsOfGuestsRoomType withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|VariationsOfGuestsRoomType withoutTrashed()
 * @mixin \Eloquent
 */
class VariationsOfGuestsRoomType extends Model
{
 use SoftDeletes;

 protected $fillable = ['room_type_id', 'number_of_adults', 'number_of_children'];

 public function roomType()
 {
  return $this->belongsTo(RoomType::class);
 }

 public function multiplier()
 {
  return $this->hasOne(VariationMultiplier::class, 'variation_id', 'id')->select(['id', 'multiplier']);
 }

 public function childAgeRanges()
 {
  return $this->hasMany(ChildAgeRanges::class, 'variation_id', 'id');
 }
}
