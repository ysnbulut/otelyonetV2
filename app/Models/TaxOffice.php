<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\TaxOffice
 *
 * @property int $id
 * @property int $province_id
 * @property string $code
 * @property string $tax_office
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|TaxOffice newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|TaxOffice newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|TaxOffice query()
 * @method static \Illuminate\Database\Eloquent\Builder|TaxOffice whereCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TaxOffice whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TaxOffice whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TaxOffice whereProvinceId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TaxOffice whereTaxOffice($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TaxOffice whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class TaxOffice extends Model
{
    use HasFactory;
}
