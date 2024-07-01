<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\UnitChannelItemPrice
 *
 * @property-read \App\Models\SalesChannel|null $channel
 * @property-read \App\Models\Item|null $product
 * @property-read \App\Models\SalesUnit|null $unit
 * @method static \Illuminate\Database\Eloquent\Builder|UnitChannelItemPrice newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|UnitChannelItemPrice newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|UnitChannelItemPrice query()
 * @mixin \Eloquent
 */
class UnitChannelItemPrice extends Model
{
    protected $fillable = [
        'sales_unit_channel_id',
        'sales_unit_item_id',
        'price_rate'
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
        return $this->belongsTo(Item::class);
    }
}
