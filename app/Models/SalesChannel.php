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

    public function units(): \Illuminate\Database\Eloquent\Relations\HasManyThrough
    {
        return $this->hasManyThrough(
            SalesUnit::class,
            SalesUnitChannels::class,
            'sales_channel_id', // Foreign key on SalesUnitChannels table
            'id', // Foreign key on SalesUnit table
            'id', // Local key on SalesChannel table
            'sales_unit_id'); // Local key on SalesUnitChannels table)
    }

    public function unitPrices()
    {
        return $this->hasManyThrough(
            UnitChannelProductPrice::class,
            SalesUnitChannels::class,
            'sales_channel_id', // Foreign key in SalesUnitChannel table
            'sales_unit_channel_id', // Foreign key in UnitChannelProductPrice table
            'id', // Local key on SalesChannel table
            'id' // Local key on SalesUnitChannel table
        );
    }
}
