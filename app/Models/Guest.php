<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\Guest
 *
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Booking> $bookings
 * @property-read int|null $bookings_count
 * @property-read mixed $full_name
 * @method static \Database\Factories\GuestFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|Guest newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Guest newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Guest onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|Guest orderByFullName()
 * @method static \Illuminate\Database\Eloquent\Builder|Guest query()
 * @method static \Illuminate\Database\Eloquent\Builder|Guest withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|Guest withoutTrashed()
 * @method filter(array $only)
 * @mixin \Eloquent
 */
class Guest extends Model
{
 use SoftDeletes;

	protected $fillable = ['name', 'surname', 'nationality', 'identification_number', 'phone', 'email', 'gender'];

	public function getFullNameAttribute()
 {
  return $this->name . ' ' . $this->surname;
 }

 public function scopeOrderByFullName($query)
 {
  $query->orderBy('last_name')->orderBy('first_name');
 }

    public function scopeFilter($query, array $filters)
    {
        $query
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query
                        ->where('name', 'like', '%' . $search . '%')
                        ->orWhere('surname', 'like', '%' . $search . '%')
                        ->orWhere('identification_number', 'like', '%' . $search . '%')
                        ->orWhere('phone', 'like', '%' . $search . '%')
                        ->orWhere('email', 'like', '%' . $search . '%');
                });
            });
//            ->when($filters['trashed'] ?? null, function ($query, $trashed) {
//                if ($trashed === 'with') {
//                    $query->withTrashed();
//                } elseif ($trashed === 'only') {
//                    $query->onlyTrashed();
//                }
//            });
    }

 public function bookings()
 {
  return $this->hasManyThrough(Booking::class, BookingGuests::class, 'guest_id', 'id', 'id', 'booking_id');
 }
}
