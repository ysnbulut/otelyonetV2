<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SalesArea extends Model
{
    use softDeletes;

    protected $fillable = [
        'name',
        'description',
        'order',
    ];

    public function unit(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(SalesUnit::class, 'sales_unit_id');
    }
}
