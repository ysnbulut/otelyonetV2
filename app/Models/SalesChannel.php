<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\SalesChannel
 *
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\UnitChannelItemPrice> $unitPrices
 * @property-read int|null $unit_prices_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\SalesUnit> $units
 * @property-read int|null $units_count
 * @method static \Illuminate\Database\Eloquent\Builder|SalesChannel newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|SalesChannel newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|SalesChannel onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|SalesChannel query()
 * @method static \Illuminate\Database\Eloquent\Builder|SalesChannel withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|SalesChannel withoutTrashed()
 * @mixin \Eloquent
 */
class SalesChannel extends Model
{
    use softDeletes;

    protected $fillable = [
        'name',
        'description',
    ];

    public function units(): \Illuminate\Database\Eloquent\Relations\HasManyThrough
    {
        return $this->hasManyThrough(
            SalesUnit::class,
            SalesUnitChannel::class,
            'sales_channel_id', // Foreign key on SalesUnitChannel table
            'id', // Foreign key on SalesUnit table
            'id', // Local key on SalesChannel table
            'sales_unit_id'); // Local key on SalesUnitChannel table)
    }

    public function unitPrices()
    {
        return $this->hasManyThrough(
            UnitChannelItemPrice::class,
            SalesUnitChannel::class,
            'sales_channel_id', // Foreign key in SalesUnitChannel table
            'sales_unit_channel_id', // Foreign key in UnitChannelItemPrice table
            'id', // Local key on SalesChannel table
            'id' // Local key on SalesUnitChannel table
        );
    }
}
