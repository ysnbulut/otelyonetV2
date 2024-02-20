<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UnitChannelProductPrice extends Model
{
    protected $fillable = [
        'sales_unit_channel_id',
        'sales_unit_product_id',
        'price'
    ];
    public function unit(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(SalesUnit::class);
    }

    public function channel(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(SalesChannel::class);
    }

    public function product(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
