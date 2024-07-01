<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\ChildAgeRange
 *
 * @property-read VariationsOfGuestsRoomType|null $possibility
 * @method static Builder|ChildAgeRange newModelQuery()
 * @method static Builder|ChildAgeRange newQuery()
 * @method static Builder|ChildAgeRange onlyTrashed()
 * @method static Builder|ChildAgeRange query()
 * @method static Builder|ChildAgeRange withTrashed()
 * @method static Builder|ChildAgeRange withoutTrashed()
 * @mixin Eloquent
 */
class ChildAgeRange extends Model
{
 use SoftDeletes;

 protected $fillable = ['min_age', 'max_age'];

 public function possibility()
 {
  return $this->belongsTo(VariationsOfGuestsRoomType::class);
 }
}
