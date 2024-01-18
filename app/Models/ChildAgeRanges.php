<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\ChildAgeRanges
 *
 * @property-read VariationsOfGuestsRoomType|null $possibility
 * @method static Builder|ChildAgeRanges newModelQuery()
 * @method static Builder|ChildAgeRanges newQuery()
 * @method static Builder|ChildAgeRanges onlyTrashed()
 * @method static Builder|ChildAgeRanges query()
 * @method static Builder|ChildAgeRanges withTrashed()
 * @method static Builder|ChildAgeRanges withoutTrashed()
 * @mixin Eloquent
 */
class ChildAgeRanges extends Model
{
 use SoftDeletes;

 protected $fillable = ['min_age', 'max_age'];

 public function possibility()
 {
  return $this->belongsTo(VariationsOfGuestsRoomType::class);
 }
}
