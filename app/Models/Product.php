<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Products extends Model implements HasMedia
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

    public function productCategory(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(ProductsCategory::class);
    }
}
