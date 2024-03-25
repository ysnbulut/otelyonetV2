<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\BookingTotalPrice
 *
 * @method static Builder|BookingTotalPrice newModelQuery()
 * @method static Builder|BookingTotalPrice newQuery()
 * @method static Builder|BookingTotalPrice onlyTrashed()
 * @method static Builder|BookingTotalPrice query()
 * @method static Builder|BookingTotalPrice withTrashed()
 * @method static Builder|BookingTotalPrice withoutTrashed()
 * @mixin Eloquent
 */
class BookingTotalPrice extends Model
{
 use SoftDeletes;

 protected $fillable = ['booking_id', 'price', 'booking_campaign_id', 'discount', 'total_price', 'tax',
     'grand_total', 'currency'];
}
