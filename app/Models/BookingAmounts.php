<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\BookingAmounts
 *
 * @method static \Database\Factories\BookingAmountsFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|BookingAmounts newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|BookingAmounts newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|BookingAmounts onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|BookingAmounts query()
 * @method static \Illuminate\Database\Eloquent\Builder|BookingAmounts withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|BookingAmounts withoutTrashed()
 * @mixin \Eloquent
 */
class BookingAmounts extends Model
{
 use HasFactory, SoftDeletes;

 protected $fillable = ['booking_id', 'price', 'campaign', 'discount', 'total_price', 'tax', 'grand_total'];
}
