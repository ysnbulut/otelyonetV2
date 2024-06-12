<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class CMTransaction extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'id',
        'status',
        'errors'
    ];


    public function transactionable(): MorphTo
    {
        return $this->morphTo();
    }
}
