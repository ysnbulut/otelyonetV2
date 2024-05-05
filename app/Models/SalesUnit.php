<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\SalesUnit
 *
 * @property-read Collection<int, SalesArea> $areas
 * @property-read int|null $areas_count
 * @property-read Collection<int, SalesChannel> $channels
 * @property-read int|null $channels_count
 * @property-read Collection<int, Item> $items
 * @property-read int|null $items_count
 * @property-read Collection<int, Service> $services
 * @property-read int|null $services_count
 * @method static \Illuminate\Database\Eloquent\Builder|SalesUnit newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|SalesUnit newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|SalesUnit onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|SalesUnit query()
 * @method static \Illuminate\Database\Eloquent\Builder|SalesUnit withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|SalesUnit withoutTrashed()
 * @property-read \App\Models\Document|null $document
 * @mixin \Eloquent
 */
class SalesUnit extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'description'
    ];

    public function channels(): BelongsToMany
    {
        return $this->belongsToMany(SalesChannel::class, 'sales_unit_channels', 'sales_unit_id', 'sales_channel_id', 'id', 'id')->withPivot('id');
    }

    public function items(): HasManyThrough
    {
        return $this->hasManyThrough(Item::class, SalesUnitItem::class, 'sales_unit_id', 'id', 'id', 'item_id');
    }

    public function documents(): morphMany
    {
        return $this->morphMany(Document::class, 'unit');
    }

    public function areas(): HasMany
    {
        return $this->hasMany(SalesArea::class);
    }
}
