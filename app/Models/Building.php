<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\Building
 *
 * @property-read Collection<int, Floor> $floors
 * @property-read int|null $floors_count
 * @property-read Collection<int, Room> $rooms
 * @property-read int|null $rooms_count
 * @method static Builder|Building newModelQuery()
 * @method static Builder|Building newQuery()
 * @method static Builder|Building onlyTrashed()
 * @method static Builder|Building query()
 * @method static Builder|Building withTrashed()
 * @method static Builder|Building withoutTrashed()
 * @mixin Eloquent
 */
class Building extends Model
{
	use SoftDeletes;

	protected $fillable = ['name', 'description'];

	public function floors()
	{
		return $this->hasMany(Floor::class);
	}

	public function rooms()
	{
		return $this->hasManyThrough(Room::class, Floor::class);
	}
}
