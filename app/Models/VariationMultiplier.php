<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\VariationMultiplier
 *
 * @property-read RoomType|null $roomType
 * @property-read VariationsOfGuestsRoomType|null $variation
 * @method static Builder|VariationMultiplier newModelQuery()
 * @method static Builder|VariationMultiplier newQuery()
 * @method static Builder|VariationMultiplier onlyTrashed()
 * @method static Builder|VariationMultiplier query()
 * @method static Builder|VariationMultiplier withTrashed()
 * @method static Builder|VariationMultiplier withoutTrashed()
 * @mixin Eloquent
 */
class VariationMultiplier extends Model
{
 use SoftDeletes;

 protected $fillable = ['room_type_id', 'variation_id', 'multiplier'];
 protected $table = 'variation_multipliers';

 public function variation(): \Illuminate\Database\Eloquent\Relations\BelongsTo
 {
  return $this->belongsTo(VariationsOfGuestsRoomType::class, 'variation_id', 'id');
 }

 public function roomType(): \Illuminate\Database\Eloquent\Relations\BelongsTo
 {
  return $this->belongsTo(RoomType::class);
 }
}
