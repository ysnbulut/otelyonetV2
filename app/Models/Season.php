<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\Season
 *
 * @property-read mixed $season_name
 * @property-read mixed $end_date
 * @property-read mixed $start_date
 * @method static Builder|Season avilableSeasons()
 * @method static Builder|Season newModelQuery()
 * @method static Builder|Season newQuery()
 * @method static Builder|Season onlyTrashed()
 * @method static Builder|Season query()
 * @method static Builder|Season unitPrices()
 * @method static Builder|Season withTrashed()
 * @method static Builder|Season withoutTrashed()
 * @property-read Collection<int, UnitPrice> $unitPrices
 * @property-read int|null $unit_prices_count
 * @mixin Eloquent
 */
class Season extends Model
{
    use SoftDeletes;

    protected $fillable = ['uid', 'name', 'description', 'start_date', 'end_date'];

    public function unitPrices() : HasMany
    {
        return $this->hasMany(UnitPrice::class);
    }

    public function setStartDateAttribute($value): void
    {
        $this->attributes['start_date'] = date('Y-m-d', strtotime($value));
    }

    public function setEndDateAttribute($value): void
    {
        $this->attributes['end_date'] = date('Y-m-d', strtotime($value));
    }

    public function getSeasonNameAttribute(): string
    {
        return $this->name .
            ' (' .
            date('d.m.Y', strtotime($this->start_date)) .
            ' - ' .
            date('d.m.Y', strtotime($this->end_date)) .
            ')';
    }

    public function scopeAvilableSeasons($query)
    {
        return $query
            ->orderBy('start_date')
            ->whereDate('start_date', '<=', date('Y-m-d'))
            ->whereDate('end_date', '>=', date('Y-m-d'))
            ->orWhereDate('start_date', '>=', date('Y-m-d'));
    }
}
