<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\BookingPayments
 *
 * @property-read Booking|null $booking
 * @property-read CaseAndBanks|null $case
 * @property-read Customer|null $customer
 * @method static Builder|BookingPayments newModelQuery()
 * @method static Builder|BookingPayments newQuery()
 * @method static Builder|BookingPayments onlyTrashed()
 * @method static Builder|BookingPayments query()
 * @method static Builder|BookingPayments withTrashed()
 * @method static Builder|BookingPayments withoutTrashed()
 * @mixin Eloquent
 */
class BookingPayments extends Model
{
	use SoftDeletes;

	protected $fillable = [
		'customer_id',
		'booking_id',
		'case_and_banks_id',
		'payment_date',
		'currency',
		'payment_method',
		'currency_amount',
		'amount_paid',
		'description',
	];

	public function customer(): BelongsTo
	{
		return $this->belongsTo(Customer::class, 'customer_id', 'id');
	}

	public function booking(): BelongsTo
	{
		return $this->belongsTo(Booking::class, 'booking_id', 'id');
	}

	public function case(): BelongsTo
	{
		return $this->belongsTo(CaseAndBanks::class, 'case_and_banks_id', 'id');
	}
}
