<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\ServiceType
 *
 * @method static Builder|ServiceType newModelQuery()
 * @method static Builder|ServiceType newQuery()
 * @method static Builder|ServiceType onlyTrashed()
 * @method static Builder|ServiceType query()
 * @method static Builder|ServiceType withTrashed()
 * @method static Builder|ServiceType withoutTrashed()
 * @mixin Eloquent
 */
class ServiceType extends Model
{
	use SoftDeletes;
}
