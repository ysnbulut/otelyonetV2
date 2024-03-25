<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\SalesArea
 *
 * @property-read \App\Models\SalesUnit|null $unit
 * @method static \Illuminate\Database\Eloquent\Builder|SalesArea newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|SalesArea newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|SalesArea onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|SalesArea query()
 * @method static \Illuminate\Database\Eloquent\Builder|SalesArea withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|SalesArea withoutTrashed()
 * @mixin \Eloquent
 */
class SalesArea extends Model
{
    use softDeletes;

    protected $fillable = [
        'name',
        'description',
        'order',
    ];

    public function unit(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(SalesUnit::class, 'sales_unit_id');
    }
}
