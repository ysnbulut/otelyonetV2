<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\VariationMultiplier
 *
 * @property-read \App\Models\RoomType|null $roomType
 * @property-read \App\Models\VariationsOfGuestsRoomType|null $variation
 * @method static \Illuminate\Database\Eloquent\Builder|VariationMultiplier newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|VariationMultiplier newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|VariationMultiplier onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|VariationMultiplier query()
 * @method static \Illuminate\Database\Eloquent\Builder|VariationMultiplier withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|VariationMultiplier withoutTrashed()
 * @mixin \Eloquent
 */
class VariationMultiplier extends Model
{
 use SoftDeletes;

 protected $fillable = ['room_type_id', 'variation_id', 'multiplier'];
 protected $table = 'variation_multipliers';

 public function variation()
 {
  return $this->belongsTo(VariationsOfGuestsRoomType::class, 'variation_id', 'id');
 }

 public function roomType()
 {
  return $this->belongsTo(RoomType::class);
 }
}
