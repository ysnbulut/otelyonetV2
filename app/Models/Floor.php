<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\Floor
 *
 * @property-read \App\Models\Building|null $building
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Room> $rooms
 * @property-read int|null $rooms_count
 * @method static \Illuminate\Database\Eloquent\Builder|Floor newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Floor newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Floor onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|Floor query()
 * @method static \Illuminate\Database\Eloquent\Builder|Floor withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|Floor withoutTrashed()
 * @mixin \Eloquent
 */
class Floor extends Model
{
	use HasFactory, SoftDeletes;

	protected $fillable = ['building_id', 'name'];

	public function building()
	{
		return $this->belongsTo(Building::class);
	}

	public function rooms()
	{
		return $this->hasMany(Room::class);
	}
}
