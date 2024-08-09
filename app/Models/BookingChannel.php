<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\BookingChannel
 *
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Booking> $bookings
 * @property-read int|null $bookings_count
 * @method static \Illuminate\Database\Eloquent\Builder|BookingChannel newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|BookingChannel newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|BookingChannel onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|BookingChannel query()
 * @method static \Illuminate\Database\Eloquent\Builder|BookingChannel withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|BookingChannel withoutTrashed()
 * @mixin \Eloquent
 */
class BookingChannel extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'code',
        'name',
        'active',
    ];

    public function bookings(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Booking::class);
    }
}
