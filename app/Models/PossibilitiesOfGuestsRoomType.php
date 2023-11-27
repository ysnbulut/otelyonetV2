<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\PossibilitiesOfGuestsRoomType
 *
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\ChildAgeRanges> $childAgeRanges
 * @property-read int|null $child_age_ranges_count
 * @property-read \App\Models\PossibilitiesMultiplier|null $possibilitiesMultipliers
 * @property-read \App\Models\RoomType|null $roomType
 * @method static \Database\Factories\PossibilitiesOfGuestsRoomTypeFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|PossibilitiesOfGuestsRoomType newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|PossibilitiesOfGuestsRoomType newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|PossibilitiesOfGuestsRoomType onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|PossibilitiesOfGuestsRoomType query()
 * @method static \Illuminate\Database\Eloquent\Builder|PossibilitiesOfGuestsRoomType withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|PossibilitiesOfGuestsRoomType withoutTrashed()
 * @mixin \Eloquent
 */
class PossibilitiesOfGuestsRoomType extends Model
{
 use HasFactory, SoftDeletes;

 protected $fillable = ['room_type_id', 'number_of_adults', 'number_of_children'];

 public function roomType()
 {
  return $this->belongsTo(RoomType::class);
 }

 public function possibilitiesMultipliers()
 {
  return $this->hasOne(PossibilitiesMultiplier::class, 'possibility_id', 'id');
 }

 public function childAgeRanges()
 {
  return $this->hasMany(ChildAgeRanges::class, 'possibility_id', 'id');
 }
}
