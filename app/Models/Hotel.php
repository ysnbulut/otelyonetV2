<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\Hotel
 *
 * @property int $id
 * @property string $tenant_id
 * @property string $status
 * @property string $name
 * @property string $register_date
 * @property string $renew_date
 * @property float $price
 * @property float $renew_price
 * @property string|null $title
 * @property string|null $address
 * @property int|null $province_id
 * @property int|null $district_id
 * @property string|null $location
 * @property int|null $tax_office_id
 * @property string|null $tax_number
 * @property string|null $phone
 * @property string|null $email
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property-read \App\Models\District|null $district
 * @property-read \App\Models\Province|null $province
 * @property-read \App\Models\TaxOffice|null $tax_office
 * @property-read \App\Models\Tenant|null $tenant
 * @method static \Illuminate\Database\Eloquent\Builder|Hotel newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Hotel newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Hotel onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|Hotel query()
 * @method static \Illuminate\Database\Eloquent\Builder|Hotel whereAddress($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Hotel whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Hotel whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Hotel whereDistrictId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Hotel whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Hotel whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Hotel whereLocation($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Hotel whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Hotel wherePhone($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Hotel wherePrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Hotel whereProvinceId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Hotel whereRegisterDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Hotel whereRenewDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Hotel whereRenewPrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Hotel whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Hotel whereTaxNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Hotel whereTaxOfficeId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Hotel whereTenantId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Hotel whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Hotel whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Hotel withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|Hotel withoutTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|Hotel filter(array $filters)
 * @mixin \Eloquent
 */
class Hotel extends Model
{
    use SoftDeletes;

    protected $connection = 'mysql';

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

    public function scopeFilter($query, array $filters)
    {
        $query
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query
                        ->where('title', 'like', '%' . $search . '%')
                        ->orWhere('name', 'like', '%' . $search . '%')
                        ->orWhere('tax_number', 'like', '%' . $search . '%')
                        ->orWhere('phone', 'like', '%' . $search . '%')
                        ->orWhere('email', 'like', '%' . $search . '%');
                });
            });
//            ->when($filters['trashed'] ?? null, function ($query, $trashed) {
//                if ($trashed === 'with') {
//                    $query->withTrashed();
//                } elseif ($trashed === 'only') {
//                    $query->onlyTrashed();
//                }
//            });
    }
}
