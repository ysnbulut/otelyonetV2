<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\Tax
 *
 * @method static \Illuminate\Database\Eloquent\Builder|Tax newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Tax newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Tax onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|Tax query()
 * @method static \Illuminate\Database\Eloquent\Builder|Tax withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|Tax withoutTrashed()
 * @mixin \Eloquent
 */
class Tax extends Model
{
    use softDeletes;

    protected $fillable = [
        'name',
        'description',
        'rate',
        'enabled'
    ];

    protected $casts = [
        'rate' => 'decimal:4',
        'enabled' => 'boolean'
    ];
}
