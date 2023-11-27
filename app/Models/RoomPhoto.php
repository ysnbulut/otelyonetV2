<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\RoomPhoto
 *
 * @method static \Illuminate\Database\Eloquent\Builder|RoomPhoto newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|RoomPhoto newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|RoomPhoto onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|RoomPhoto query()
 * @method static \Illuminate\Database\Eloquent\Builder|RoomPhoto withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|RoomPhoto withoutTrashed()
 * @mixin \Eloquent
 */
class RoomPhoto extends Model
{
	use HasFactory, SoftDeletes;
}
