<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\RoomView
 *
 * @method static \Illuminate\Database\Eloquent\Builder|RoomView newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|RoomView newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|RoomView onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|RoomView query()
 * @method static \Illuminate\Database\Eloquent\Builder|RoomView withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|RoomView withoutTrashed()
 * @mixin \Eloquent
 */
class RoomView extends Model
{
	use HasFactory, SoftDeletes;

	protected $fillable = ['name', 'description'];
}
