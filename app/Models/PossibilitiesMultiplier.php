<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\PossibilitiesMultiplier
 *
 * @property-read \App\Models\PossibilitiesOfGuestsRoomType|null $possibility
 * @property-read \App\Models\RoomType|null $roomType
 * @method static \Database\Factories\PossibilitiesMultiplierFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|PossibilitiesMultiplier newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|PossibilitiesMultiplier newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|PossibilitiesMultiplier onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|PossibilitiesMultiplier query()
 * @method static \Illuminate\Database\Eloquent\Builder|PossibilitiesMultiplier withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|PossibilitiesMultiplier withoutTrashed()
 * @mixin \Eloquent
 */
class PossibilitiesMultiplier extends Model
{
 use HasFactory, SoftDeletes;

 protected $fillable = ['room_type_id', 'possibility_id', 'multiplier'];
 // protected $table = 'possibilities_multipliers';

 public function possibility()
 {
  return $this->belongsTo(PossibilitiesOfGuestsRoomType::class, 'possibility_id', 'id');
 }

 public function roomType()
 {
  return $this->belongsTo(RoomType::class);
 }
}
