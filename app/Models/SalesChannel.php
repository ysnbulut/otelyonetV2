<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SalesChannel extends Model
{
    use softDeletes;

    protected $fillable = [
        'name',
        'description',
    ];

    public function units(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(SalesUnit::class, 'sales_unit_channels', 'sales_channel_id', 'sales_unit_id');
    }

    public function products(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'sales_unit_products', 'sales_channel_id', 'product_id');
    }

    public function services(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(Service::class, 'sales_unit_services', 'sales_channel_id', 'service_id');
    }
}
