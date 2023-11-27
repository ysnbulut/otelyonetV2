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
 * @method static \Database\Factories\CustomerFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|Customer newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Customer newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Customer onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|Customer query()
 * @method static \Illuminate\Database\Eloquent\Builder|Customer remainingBalance()
 * @method static \Illuminate\Database\Eloquent\Builder|Customer search($searchTerm)
 * @method static \Illuminate\Database\Eloquent\Builder|Customer transactions()
 * @method static \Illuminate\Database\Eloquent\Builder|Customer withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|Customer withoutTrashed()
 * @method filter(array $only)
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

  public function scopeTransactions(): LengthAwarePaginator
  {
    $settings = new GeneralSettings();
    return $this->bookings()
      ->select(['id', 'customer_id', 'check_in as date', 'type' => DB::raw("'booking'")])
      ->union(
        $this->payments()
          ->select(['id', 'customer_id', 'payment_date as date', 'type' => DB::raw("'payment'")])
      )->orderBy('date', 'desc')
      ->paginate(10)->through(function ($transaction) use ($settings) {
        $info = '';
        if ($transaction->booking === 'booking') {
          $booking = $this->bookings()->where('id', $transaction->id)->first();
          $amount = $booking->amount->grand_total;
          $currency = $settings->currency;
          $info .= $booking->rooms->pluck('name')->implode(', ') . ' - ' . $booking->stayDurationNight() . ' (' . $booking->rooms->sum('pivot.number_of_adults') . ' Yetişkin ' . $booking->rooms->sum('pivot.number_of_children') . ' Çocuk)';
        } else {
          $payment = $this->payments()->where('id', $transaction->id)->first();
          if ($payment->payment_method == 'cash') {
            $payment_method = 'Nakit';
          } elseif ($payment->payment_method == 'credit_card') {
            $payment_method = 'Kredi Kartı';
          } elseif ($payment->payment_method == 'bank_transfer') {
            $payment_method = 'Banka Havale/EFT';
          } else {
            $payment_method = 'Bilinmiyor.';
          }
          if ($payment->currency !== $settings->currency) {
            $amount = $payment->currency_amount;
            $info .= '(' . number_format($payment->amount_paid, 2, ',', '.') . ' ' . $settings->currency . ') ';
          } else {
            $amount = $payment->amount_paid;
          }
          $currency = $payment->currency;
          $info .= $payment->case->name . ' ' . $payment_method . ' Ödendi. ';
          $info .= $payment->description !== NULL ? '(' . $payment->description . ')' : '';
        }
        $amount_formatted = number_format($amount, 2, ',', '.') . ' ' . $currency;
        return [
          'id' => $transaction->id,
          'customer_id' => $transaction->customer_id,
          'type' => $transaction->booking === 'booking' ? 'Rezervasyon' : 'Ödeme',
          'date' => Carbon::createFromFormat('Y-m-d', $transaction->date)->format('d.m.Y'),
          'amount' => $amount_formatted,
          'info' => $info,
        ];
      });
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
