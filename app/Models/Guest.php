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
 * @property mixed $birthday
 * @property mixed $citizen_id
 * @method static Builder|Guest filter(array $filters)
 * @method static Builder|Guest newModelQuery()
 * @method static Builder|Guest newQuery()
 * @method static Builder|Guest onlyTrashed()
 * @method static Builder|Guest orderByFullName()
 * @method static Builder|Guest query()
 * @method static Builder|Guest withTrashed()
 * @method static Builder|Guest withoutTrashed()
 * @property-read Collection<int, \App\Models\BookingRoom> $booking_room
 * @property-read int|null $booking_room_count
 * @mixin Eloquent
 */
class Guest extends Model
{
    use SoftDeletes;

    protected $fillable = ['name', 'surname', 'is_foreign_national', 'citizen_id', 'birthday', 'identification_number',
        'phone', 'email', 'gender'];

    public function getFullNameAttribute(): string
    {
        return $this->name . ' ' . $this->surname;
    }

    public function scopeOrderByFullName($query): void
    {
        $query->orderBy('last_name')->orderBy('first_name');
    }

    public function scopeFilter($query, array $filters): void
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

    public function booking_room(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(BookingRoom::class, 'booking_guests', 'guest_id', 'booking_room_id');
    }

    public function citizen(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(Citizen::class, 'id', 'citizen_id');
    }
}
