<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\RoomTypeFeature
 *
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\RoomType> $roomTypes
 * @property-read int|null $room_types_count
 * @method static \Illuminate\Database\Eloquent\Builder|RoomTypeFeature newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|RoomTypeFeature newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|RoomTypeFeature onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|RoomTypeFeature query()
 * @method static \Illuminate\Database\Eloquent\Builder|RoomTypeFeature withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|RoomTypeFeature withoutTrashed()
 * @mixin \Eloquent
 */
class RoomTypeFeature extends Model
{
	use HasFactory, SoftDeletes;

	protected $fillable = ['name'];

	public function roomTypes()
	{
		return $this->belongsToMany(RoomType::class, 'type_has_features', 'feature_id', 'type_id');
	}
}
