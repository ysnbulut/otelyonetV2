<?php

namespace App\Models;

use App\Settings\GeneralSettings;
use Carbon\Carbon;
use DB;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Pagination\LengthAwarePaginator;

/**
 * App\Models\Customer
 *
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Booking> $bookings
 * @property-read int|null $bookings_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\CustomerPayments> $payments
 * @property-read int|null $payments_count
 * @method static \Illuminate\Database\Eloquent\Builder|Customer filter(array $filters)
 * @method static \Illuminate\Database\Eloquent\Builder|Customer newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Customer newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Customer onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|Customer query()
 * @method static \Illuminate\Database\Eloquent\Builder|Customer remainingBalance()
 * @method static \Illuminate\Database\Eloquent\Builder|Customer search($searchTerm)
 * @method static \Illuminate\Database\Eloquent\Builder|Customer withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|Customer withoutTrashed()
 * @mixin \Eloquent
 */
class Customer extends Model
{
  use HasFactory, SoftDeletes;

  protected $fillable = ['title', 'type', 'tax_number', 'city', 'country', 'address', 'phone', 'email'];

  public function scopeRemainingBalance()
  {
    $bookingAmount = $this->bookings()
      ->join('booking_amounts', 'bookings.id', '=', 'booking_amounts.booking_id')
      ->whereNull('bookings.deleted_at')
      ->sum('booking_amounts.grand_total');
    $paymentAmount = $this->payments()->sum('amount_paid');
    return $paymentAmount - $bookingAmount;
  }

  public function bookings(): HasMany
  {
    return $this->hasMany(Booking::class, 'customer_id', 'id');
  }

  public function payments(): HasMany
  {
    return $this->hasMany(CustomerPayments::class, 'customer_id', 'id');
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

  /**
   * @param $query
   * @param $searchTerm
   * @return mixed
   */
  public function scopeSearch($query, $searchTerm)
  {
    return $query
      ->where('title', 'LIKE', '%' . $searchTerm . '%')
      ->orWhere('tax_number', 'LIKE', '%' . $searchTerm . '%');
  }
}
