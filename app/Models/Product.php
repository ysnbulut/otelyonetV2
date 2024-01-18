<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Product extends Model implements HasMedia
{
    use SoftDeletes, InteractsWithMedia;

    protected $fillable = [
        'product_category_id',
        'name',
        'description',
        'sku',
        'cost',
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
        return $this->belongsTo(ProductCategory::class);
    }

    public function prices(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(SalesChannel::class, 'unit_channel_product_prices', 'product_id', 'sales_unit_channel_id')
            ->withPivot('price');
    }
}
