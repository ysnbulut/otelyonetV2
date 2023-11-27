<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\ServiceType
 *
 * @method static \Database\Factories\ServiceTypeFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|ServiceType newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ServiceType newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ServiceType onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|ServiceType query()
 * @method static \Illuminate\Database\Eloquent\Builder|ServiceType withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|ServiceType withoutTrashed()
 * @mixin \Eloquent
 */
class ServiceType extends Model
{
	use HasFactory, SoftDeletes;
}
