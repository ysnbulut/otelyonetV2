<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\Guest
 *
 * @property-read Collection<int, Booking> $bookings
 * @property-read int|null $bookings_count
 * @property-read mixed $full_name
 * @method static Builder|Guest filter(array $filters)
 * @method static Builder|Guest newModelQuery()
 * @method static Builder|Guest newQuery()
 * @method static Builder|Guest onlyTrashed()
 * @method static Builder|Guest orderByFullName()
 * @method static Builder|Guest query()
 * @method static Builder|Guest withTrashed()
 * @method static Builder|Guest withoutTrashed()
 * @mixin Eloquent
 */
class Guest extends Model
{
    use SoftDeletes;

    protected $fillable = ['name', 'surname', 'is_foreign_national', 'nationality', 'identification_number', 'phone', 'email', 'gender'];

    public function getFullNameAttribute(): string
    {
        return $this->name . ' ' . $this->surname;
    }

    public function scopeOrderByFullName($query)
    {
        $query->orderBy('last_name')->orderBy('first_name');
    }

    public function scopeFilter($query, array $filters)
    {
        $query->when($filters['search'] ?? null, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query->where('name', 'like', '%' . $search . '%')->orWhere('surname', 'like', '%' . $search . '%')->orWhere('identification_number', 'like', '%' . $search . '%')->orWhere('phone', 'like', '%' . $search . '%')->orWhere('email', 'like', '%' . $search . '%');
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

    public function booking_room()
    {
        return $this->belongsToMany(BookingRooms::class, 'booking_guests', 'guest_id', 'booking_room_id');
    }
}
