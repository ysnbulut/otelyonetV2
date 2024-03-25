<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\UnitChannelProductPrice
 *
 * @property-read \App\Models\SalesChannel|null $channel
 * @property-read \App\Models\Product|null $product
 * @property-read \App\Models\SalesUnit|null $unit
 * @method static \Illuminate\Database\Eloquent\Builder|UnitChannelProductPrice newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|UnitChannelProductPrice newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|UnitChannelProductPrice query()
 * @mixin \Eloquent
 */
class UnitChannelProductPrice extends Model
{
    protected $fillable = [
        'sales_unit_channel_id',
        'sales_unit_product_id',
        'price'
    ];
    public function unit(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(SalesUnit::class);
    }

    public function channel(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(SalesChannel::class);
    }

    public function product(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
