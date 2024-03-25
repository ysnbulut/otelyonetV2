<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\SalesUnitService
 *
 * @property-read \App\Models\Service|null $service
 * @property-read \App\Models\SalesUnit|null $unit
 * @method static \Illuminate\Database\Eloquent\Builder|SalesUnitService newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|SalesUnitService newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|SalesUnitService query()
 * @mixin \Eloquent
 */
class SalesUnitService extends Model
{
    public function unit(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(SalesUnit::class);
    }

    public function service(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Service::class);
    }
}
