<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\ServiceCategory
 *
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Service> $services
 * @property-read int|null $services_count
 * @method static \Illuminate\Database\Eloquent\Builder|ServiceCategory newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ServiceCategory newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ServiceCategory onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|ServiceCategory query()
 * @method static \Illuminate\Database\Eloquent\Builder|ServiceCategory withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|ServiceCategory withoutTrashed()
 * @mixin \Eloquent
 */
class ServiceCategory extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'description',
    ];

    public function services(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Service::class);
    }

}
