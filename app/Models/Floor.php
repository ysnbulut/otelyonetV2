<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\Floor
 *
 * @property-read Building|null $building
 * @property-read Collection<int, Room> $rooms
 * @property-read int|null $rooms_count
 * @method static Builder|Floor newModelQuery()
 * @method static Builder|Floor newQuery()
 * @method static Builder|Floor onlyTrashed()
 * @method static Builder|Floor query()
 * @method static Builder|Floor withTrashed()
 * @method static Builder|Floor withoutTrashed()
 * @mixin Eloquent
 */
class Floor extends Model
{
	use SoftDeletes;

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
