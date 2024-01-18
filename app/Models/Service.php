<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Service extends Model implements HasMedia
{
    use SoftDeletes, InteractsWithMedia;

    protected $fillable = [
        'service_category_id',
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
        $this->addMediaCollection('service_images');
    }

    public function serviceCategory(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(ServiceCategory::class);
    }
}
