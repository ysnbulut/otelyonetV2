<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\VariationsOfGuestsRoomType
 *
 * @property-read Collection<int, ChildAgeRanges> $childAgeRanges
 * @property-read int|null $child_age_ranges_count
 * @property-read VariationMultiplier|null $multiplier
 * @property-read RoomType|null $roomType
 * @method static Builder|VariationsOfGuestsRoomType newModelQuery()
 * @method static Builder|VariationsOfGuestsRoomType newQuery()
 * @method static Builder|VariationsOfGuestsRoomType onlyTrashed()
 * @method static Builder|VariationsOfGuestsRoomType query()
 * @method static Builder|VariationsOfGuestsRoomType withTrashed()
 * @method static Builder|VariationsOfGuestsRoomType withoutTrashed()
 * @mixin Eloquent
 */
class VariationsOfGuestsRoomType extends Model
{
 use SoftDeletes;

 protected $fillable = ['room_type_id', 'number_of_adults', 'number_of_children'];

 public function roomType(): \Illuminate\Database\Eloquent\Relations\BelongsTo
 {
  return $this->belongsTo(RoomType::class);
 }

 public function multiplier(): \Illuminate\Database\Eloquent\Relations\HasOne
 {
  return $this->hasOne(VariationMultiplier::class, 'variation_id', 'id');
 }

 public function childAgeRanges(): \Illuminate\Database\Eloquent\Relations\HasMany
 {
  return $this->hasMany(ChildAgeRanges::class, 'variation_id', 'id');
 }
}
