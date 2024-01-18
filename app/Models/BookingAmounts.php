<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\BookingAmounts
 *
 * @method static Builder|BookingAmounts newModelQuery()
 * @method static Builder|BookingAmounts newQuery()
 * @method static Builder|BookingAmounts onlyTrashed()
 * @method static Builder|BookingAmounts query()
 * @method static Builder|BookingAmounts withTrashed()
 * @method static Builder|BookingAmounts withoutTrashed()
 * @mixin Eloquent
 */
class BookingAmounts extends Model
{
 use SoftDeletes;

 protected $fillable = ['booking_id', 'price', 'campaign', 'discount', 'total_price', 'tax', 'grand_total'];
}
