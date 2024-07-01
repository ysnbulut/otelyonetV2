<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\BookingDailyPrice
 *
 * @method static \Illuminate\Database\Eloquent\Builder|BookingDailyPrice newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|BookingDailyPrice newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|BookingDailyPrice query()
 * @method static \Illuminate\Database\Eloquent\Builder|BookingDailyPrice onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|BookingDailyPrice withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|BookingDailyPrice withoutTrashed()
 * @mixin \Eloquent
 */
class BookingDailyPrice extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'booking_total_price_id',
        'booking_room_id',
        'date',
        'original_price',
        'discount',
        'price',
        'currency'
    ];
}
