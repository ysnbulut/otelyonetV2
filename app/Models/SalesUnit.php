<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\SalesUnit
 *
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\SalesArea> $areas
 * @property-read int|null $areas_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\SalesChannel> $channels
 * @property-read int|null $channels_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Product> $products
 * @property-read int|null $products_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Service> $services
 * @property-read int|null $services_count
 * @method static \Illuminate\Database\Eloquent\Builder|SalesUnit newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|SalesUnit newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|SalesUnit onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|SalesUnit query()
 * @method static \Illuminate\Database\Eloquent\Builder|SalesUnit withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|SalesUnit withoutTrashed()
 * @mixin \Eloquent
 */
class SalesUnit extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'description'
    ];

    public function channels(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(SalesChannel::class, 'sales_unit_channels', 'sales_unit_id', 'sales_channel_id', 'id', 'id')->withPivot('id');
    }

    public function products(): \Illuminate\Database\Eloquent\Relations\HasManyThrough
    {
        return $this->hasManyThrough(Product::class, SalesUnitProduct::class, 'sales_unit_id', 'id', 'id', 'product_id');
    }

    public function services(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(Service::class, 'sales_unit_services', 'sales_unit_id', 'service_id');
    }

    public function areas(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(SalesArea::class);
    }
}
