<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\Season
 *
 * @property-read mixed $season_name
 * @property-write mixed $end_date
 * @property-write mixed $start_date
 * @method static \Illuminate\Database\Eloquent\Builder|Season avilableSeasons()
 * @method static \Illuminate\Database\Eloquent\Builder|Season newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Season newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Season onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|Season query()
 * @method static \Illuminate\Database\Eloquent\Builder|Season unitPrices()
 * @method static \Illuminate\Database\Eloquent\Builder|Season withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|Season withoutTrashed()
 * @mixin \Eloquent
 */
class Season extends Model
{
    use SoftDeletes;

    protected $fillable = ['uid', 'name', 'description', 'start_date', 'end_date'];

    public function scopeUnitPrices()
    {
        return $this->hasMany(UnitPriceRoomTypeAndView::class)->select(['id', 'unit_price']);
    }

    public function setStartDateAttribute($value)
    {
        $this->attributes['start_date'] = date('Y-m-d', strtotime($value));
    }

    public function setEndDateAttribute($value)
    {
        $this->attributes['end_date'] = date('Y-m-d', strtotime($value));
    }

    public function getSeasonNameAttribute()
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
            ->where('start_date', '<=', date('Y-m-d'))
            ->where('end_date', '>=', date('Y-m-d'))
            ->orWhere('start_date', '>=', date('Y-m-d'));
    }
}
