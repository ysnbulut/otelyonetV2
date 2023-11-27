<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\ChildAgeRanges
 *
 * @property-read \App\Models\PossibilitiesOfGuestsRoomType|null $possibility
 * @method static \Database\Factories\ChildAgeRangesFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|ChildAgeRanges newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ChildAgeRanges newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ChildAgeRanges onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|ChildAgeRanges query()
 * @method static \Illuminate\Database\Eloquent\Builder|ChildAgeRanges withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|ChildAgeRanges withoutTrashed()
 * @mixin \Eloquent
 */
class ChildAgeRanges extends Model
{
 use HasFactory, SoftDeletes;

 protected $fillable = ['min_age', 'max_age'];

 public function possibility()
 {
  return $this->belongsTo(PossibilitiesOfGuestsRoomType::class);
 }
}
