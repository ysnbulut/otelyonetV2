<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\BedType
 *
 * @method static Builder|BedType newModelQuery()
 * @method static Builder|BedType newQuery()
 * @method static Builder|BedType onlyTrashed()
 * @method static Builder|BedType query()
 * @method static Builder|BedType withTrashed()
 * @method static Builder|BedType withoutTrashed()
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\RoomType> $roomTypes
 * @property-read int|null $room_types_count
 * @mixin Eloquent
 */
class BedType extends Model
{
	use SoftDeletes;

	protected $fillable = ['name', 'person_num', 'description'];

    public function roomTypes(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(RoomType::class, 'type_has_beds', 'bed_type_id', 'type_id');
    }
}
