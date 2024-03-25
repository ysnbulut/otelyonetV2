<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

/**
 * App\Models\Product
 *
 * @property-read \App\Models\ProductCategory|null $category
 * @property-read \Spatie\MediaLibrary\MediaCollections\Models\Collections\MediaCollection<int, \Spatie\MediaLibrary\MediaCollections\Models\Media> $media
 * @property-read int|null $media_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\UnitChannelProductPrice> $prices
 * @property-read int|null $prices_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\SalesUnit> $units
 * @property-read int|null $units_count
 * @method static \Illuminate\Database\Eloquent\Builder|Product filter(array $filters)
 * @method static \Illuminate\Database\Eloquent\Builder|Product newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Product newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Product onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|Product query()
 * @method static \Illuminate\Database\Eloquent\Builder|Product withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|Product withoutTrashed()
 * @mixin \Eloquent
 */
class Product extends Model implements HasMedia
{
    use SoftDeletes, InteractsWithMedia;

    protected $fillable = [
        'product_category_id',
        'name',
        'description',
        'sku',
        'price',
        'tax_rate',
        'preparation_time',
        'is_active',
    ];

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('product_images');
    }

    public function category(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(ProductCategory::class, 'product_category_id');
    }

    public function units(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(SalesUnit::class, 'sales_unit_products', 'product_id', 'sales_unit_id', 'id', 'id')->withPivot('id');
    }

    public function prices(): \Illuminate\Database\Eloquent\Relations\HasManyThrough
    {
        return $this->hasManyThrough(UnitChannelProductPrice::class, SalesUnitProduct::class, 'product_id', 'sales_unit_product_id');
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
            $query->whereIn('product_category_id', $categories);
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
