<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\BookingGuests
 *
 * @property-read Booking|null $booking
 * @property-read Guest|null $guest
 * @method static Builder|BookingGuests newModelQuery()
 * @method static Builder|BookingGuests newQuery()
 * @method static Builder|BookingGuests onlyTrashed()
 * @method static Builder|BookingGuests query()
 * @method static Builder|BookingGuests withTrashed()
 * @method static Builder|BookingGuests withoutTrashed()
 * @mixin Eloquent
 */
class BookingGuests extends Model
{
 use SoftDeletes;

 protected $fillable = ['booking_id', 'guest_id'];

 public function booking(): \Illuminate\Database\Eloquent\Relations\BelongsTo
 {
  return $this->belongsTo(Booking::class);
 }

 public function guest(): \Illuminate\Database\Eloquent\Relations\BelongsTo
 {
  return $this->belongsTo(Guest::class);
 }
}
