<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\BookingPayment
 *
 * @property-read Booking|null $booking
 * @property-read CaseAndBank|null $case
 * @property-read Customer|null $customer
 * @method static Builder|BookingPayment newModelQuery()
 * @method static Builder|BookingPayment newQuery()
 * @method static Builder|BookingPayment onlyTrashed()
 * @method static Builder|BookingPayment query()
 * @method static Builder|BookingPayment withTrashed()
 * @method static Builder|BookingPayment withoutTrashed()
 * @mixin Eloquent
 */
class BookingPayment extends Model
{
	use SoftDeletes;

	protected $fillable = [
		'customer_id',
		'booking_id',
		'case_and_bank_id',
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
		return $this->belongsTo(CaseAndBank::class, 'case_and_bank_id', 'id');
	}
}
