<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\SalesUnitProduct
 *
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\UnitChannelProductPrice> $prices
 * @property-read int|null $prices_count
 * @property-read \App\Models\Product|null $product
 * @property-read \App\Models\SalesUnit|null $unit
 * @method static \Illuminate\Database\Eloquent\Builder|SalesUnitProduct newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|SalesUnitProduct newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|SalesUnitProduct query()
 * @mixin \Eloquent
 */
class SalesUnitProduct extends Model
{
    public function product(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function unit(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(SalesUnit::class);
    }

    public function prices(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(UnitChannelProductPrice::class);
    }
}
