<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\BookingGuests
 *
 * @property-read Booking|null $booking
 * @property-read Guest|null $guest
 * @method static \Database\Factories\BookingGuestsFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|BookingGuests newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|BookingGuests newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|BookingGuests onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|BookingGuests query()
 * @method static \Illuminate\Database\Eloquent\Builder|BookingGuests withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|BookingGuests withoutTrashed()
 * @mixin Eloquent
 */
class BookingGuests extends Model
{
 use HasFactory, SoftDeletes;

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
