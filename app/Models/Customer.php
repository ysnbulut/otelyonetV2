<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\Customer
 *
 * @property-read Collection<int, Booking> $bookings
 * @property-read int|null $bookings_count
 * @property-read Collection<int, BookingPayment> $payments
 * @property-read int|null $payments_count
 * @property mixed $tax_office
 * @method static Builder|Customer filter(array $filters)
 * @method static Builder|Customer newModelQuery()
 * @method static Builder|Customer newQuery()
 * @method static Builder|Customer onlyTrashed()
 * @method static Builder|Customer query()
 * @method static Builder|Customer remainingBalance()
 * @method static Builder|Customer search($searchTerm)
 * @method static Builder|Customer withTrashed()
 * @method static Builder|Customer withoutTrashed()
 * @mixin Eloquent
 */
class Customer extends Model
{
    use SoftDeletes;

    protected $fillable = ['title', 'type', 'tax_office', 'tax_number', 'city', 'country', 'address', 'phone', 'email'];

    public function scopeRemainingBalance()
    {
        $bookingAmount = $this->bookings()
            ->join('booking_total_prices', 'bookings.id', '=', 'booking_total_prices.booking_id')
            ->whereNull('bookings.deleted_at')
            ->sum('booking_total_prices.grand_total');
        $paymentAmount = $this->payments()->sum('amount_paid');
        return $paymentAmount - $bookingAmount;
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class, 'customer_id', 'id');
    }

    public function payments(): HasMany
    {
        return $this->hasMany(BookingPayment::class, 'customer_id', 'id');
    }

    public function scopeFilter($query, array $filters)
    {
        $query
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query
                        ->where('title', 'like', '%' . $search . '%')
                        ->orWhere('tax_number', 'like', '%' . $search . '%')
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
}
