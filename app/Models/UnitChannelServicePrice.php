<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\UnitChannelServicePrice
 *
 * @property-read \App\Models\SalesChannel|null $channel
 * @property-read \App\Models\Service|null $service
 * @property-read \App\Models\SalesUnit|null $unit
 * @method static \Illuminate\Database\Eloquent\Builder|UnitChannelServicePrice newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|UnitChannelServicePrice newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|UnitChannelServicePrice query()
 * @mixin \Eloquent
 */
class UnitChannelServicePrice extends Model
{
    public function unit(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(SalesUnit::class);
    }

    public function channel(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(SalesChannel::class);
    }

    public function service(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Service::class);
    }
}
