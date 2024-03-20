<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Hotel extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'status',
        'name',
        'subdomain',
        'register_date',
        'renew_date',
        'price',
        'renew_price',
        'title',
        'address',
        'province_id',
        'district_id',
        'location',
        'tax_office_id',
        'tax_number',
        'phone',
        'email',
    ];

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }

    public function province()
    {
        return $this->belongsTo(Province::class);
    }

    public function district()
    {
        return $this->belongsTo(District::class);
    }

    public function tax_office()
    {
        return $this->belongsTo(TaxOffice::class);
    }
}
