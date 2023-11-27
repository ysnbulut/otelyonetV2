<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\BedType
 *
 * @method static \Illuminate\Database\Eloquent\Builder|BedType newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|BedType newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|BedType onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|BedType query()
 * @method static \Illuminate\Database\Eloquent\Builder|BedType withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|BedType withoutTrashed()
 * @mixin \Eloquent
 */
class BedType extends Model
{
	use HasFactory, SoftDeletes;

	protected $fillable = ['name', 'person_num', 'description'];
}
