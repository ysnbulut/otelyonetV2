<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\SalesUnitChannel
 *
 * @property-read \App\Models\SalesChannel|null $channel
 * @property-read \App\Models\SalesUnit|null $unit
 * @method static \Illuminate\Database\Eloquent\Builder|SalesUnitChannel newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|SalesUnitChannel newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|SalesUnitChannel query()
 * @mixin \Eloquent
 */
class SalesUnitChannel extends Model
{

    public function unit(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(SalesUnit::class);
    }

    public function channel(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(SalesChannel::class);
    }
}
