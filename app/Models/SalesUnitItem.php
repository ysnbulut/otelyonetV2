<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\SalesUnitItem
 *
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\UnitChannelItemPrice> $prices
 * @property-read int|null $prices_count
 * @property-read \App\Models\Item|null $product
 * @property-read \App\Models\SalesUnit|null $unit
 * @method static \Illuminate\Database\Eloquent\Builder|SalesUnitItem newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|SalesUnitItem newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|SalesUnitItem query()
 * @mixin \Eloquent
 */
class SalesUnitItem extends Model
{
    public function product(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Item::class);
    }

    public function unit(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(SalesUnit::class);
    }

    public function prices(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(UnitChannelItemPrice::class);
    }
}
