<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\Citizen
 *
 * @method static \Illuminate\Database\Eloquent\Builder|Citizen newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Citizen newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Citizen onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|Citizen query()
 * @method static \Illuminate\Database\Eloquent\Builder|Citizen withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|Citizen withoutTrashed()
 * @mixin \Eloquent
 */
class Citizen extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'code',
        'name',
    ];
}
