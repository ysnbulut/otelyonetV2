<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\Season
 *
 * @property-read mixed $season_name
 * @property-write mixed $end_date
 * @property-write mixed $start_date
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\UnitPriceRoomTypeAndView> $unitPrices
 * @property-read int|null $unit_prices_count
 * @method static \Illuminate\Database\Eloquent\Builder|Season avilableSeasons()
 * @method static \Database\Factories\SeasonFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|Season newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Season newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Season onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|Season query()
 * @method static \Illuminate\Database\Eloquent\Builder|Season withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|Season withoutTrashed()
 * @mixin \Eloquent
 */
class Season extends Model
{
 use HasFactory, SoftDeletes;

	protected $fillable = ['uid', 'name', 'start_date', 'end_date'];
	/**
	 * @var mixed|string
	 */
	private mixed $name;

	public function unitPrices()
 {
  return $this->hasMany(UnitPriceRoomTypeAndView::class);
 }

 public function setStartDateAttribute($value)
 {
  $this->attributes['start_date'] = date('Y-m-d', strtotime($value));
 }

 public function setEndDateAttribute($value)
 {
  $this->attributes['end_date'] = date('Y-m-d', strtotime($value));
 }

 public function getSeasonNameAttribute()
 {
  return $this->name .
   ' (' .
   date('d.m.Y', strtotime($this->start_date)) .
   ' - ' .
   date('d.m.Y', strtotime($this->end_date)) .
   ')';
 }

 public function scopeAvilableSeasons($query)
 {
  return $query
   ->orderBy('start_date')
   ->where('start_date', '<=', date('Y-m-d'))
   ->where('end_date', '>=', date('Y-m-d'))
   ->orWhere('start_date', '>=', date('Y-m-d'));
 }
}
