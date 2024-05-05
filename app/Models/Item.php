<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Plank\Mediable\Mediable;
use Plank\Mediable\MediableInterface;

/**
 * App\Models\Item
 *
 * @property-read ItemCategory|null $category
 * @property-read int|null $media_count
 * @property-read Collection<int, UnitChannelItemPrice> $prices
 * @property-read int|null $prices_count
 * @property-read Collection<int, SalesUnit> $units
 * @property-read int|null $units_count
 * @property mixed $taxes
 * @property mixed $tax
 * @property mixed $total_price
 * @method static \Illuminate\Database\Eloquent\Builder|Item filter(array $filters)
 * @method static \Illuminate\Database\Eloquent\Builder|Item newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Item newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Item onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|Item query()
 * @method static \Illuminate\Database\Eloquent\Builder|Item withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|Item withoutTrashed()
 * @method static \Plank\Mediable\MediableCollection<int, static> all($columns = ['*'])
 * @method static \Plank\Mediable\MediableCollection<int, static> get($columns = ['*'])
 * @method static \Illuminate\Database\Eloquent\Builder|Item whereHasMedia($tags = [], bool $matchAll = false)
 * @method static \Illuminate\Database\Eloquent\Builder|Item whereHasMediaMatchAll($tags)
 * @method static \Illuminate\Database\Eloquent\Builder|Item withMedia($tags = [], bool $matchAll = false, bool $withVariants = false)
 * @method static \Illuminate\Database\Eloquent\Builder|Item withMediaAndVariants($tags = [], bool $matchAll = false)
 * @method static \Illuminate\Database\Eloquent\Builder|Item withMediaAndVariantsMatchAll($tags = [])
 * @method static \Illuminate\Database\Eloquent\Builder|Item withMediaMatchAll(bool $tags = [], bool $withVariants = false)
 * @mixin \Eloquent
 */
class Item extends Model implements MediableInterface
{
    use SoftDeletes, Mediable;

    protected $fillable = [
        'item_category_id',
        'name',
        'description',
        'type',
        'price',
        'tax_id',
        'tax',
        'total_price',
        'preparation_time',
        'is_active',
    ];

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('item_images');
    }

    public function category(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(ItemCategory::class, 'item_category_id');
    }

    public function units(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(SalesUnit::class, 'sales_unit_items', 'item_id', 'sales_unit_id', 'id', 'id')
            ->withPivot('id');
    }

    public function taxes(): hasOne
    {
        return $this->hasOne(Tax::class, 'id', 'tax_id');
    }

    public function prices(): \Illuminate\Database\Eloquent\Relations\HasManyThrough
    {
        return $this->hasManyThrough(UnitChannelItemPrice::class, SalesUnitItem::class, 'item_id', 'sales_unit_item_id');
    }

    public function scopeFilter($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
            $query->where('name', 'like', '%'.$search.'%')
                ->orWhere('description', 'like', '%'.$search.'%');
        })->when($filters['trashed'] ?? null, function ($query, $trashed) {
            if ($trashed === 'with') {
                $query->withTrashed();
            } elseif ($trashed === 'only') {
                $query->onlyTrashed();
            }
        })->when($filters['categories'] ?? null, function ($query, $categories) {
            $query->whereIn('item_category_id', $categories);
        })->when($filters['sales_units'] ?? null, function ($query, $sales_units) {
            $query->whereHas('units', function ($query) use ($sales_units) {
                $query->whereIn('sales_unit_id', $sales_units);
            });
        })->when($filters['sales_channels'] ?? null, function ($query, $sales_channels) {
            $query->whereHas('units.channels', function ($query) use ($sales_channels) {
                $query->whereIn('sales_channel_id', $sales_channels);
            });
        });
    }

}
