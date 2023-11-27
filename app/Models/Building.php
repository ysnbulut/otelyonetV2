<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\Building
 *
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Floor> $floors
 * @property-read int|null $floors_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Room> $rooms
 * @property-read int|null $rooms_count
 * @method static \Illuminate\Database\Eloquent\Builder|Building newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Building newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Building onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|Building query()
 * @method static \Illuminate\Database\Eloquent\Builder|Building withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|Building withoutTrashed()
 * @mixin \Eloquent
 */
class Building extends Model
{
	use HasFactory, SoftDeletes;

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
