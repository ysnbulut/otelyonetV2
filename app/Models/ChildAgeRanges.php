<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\ChildAgeRanges
 *
 * @property-read \App\Models\VariationsOfGuestsRoomType|null $possibility
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
 use SoftDeletes;

 protected $fillable = ['min_age', 'max_age'];

 public function possibility()
 {
  return $this->belongsTo(VariationsOfGuestsRoomType::class);
 }
}
