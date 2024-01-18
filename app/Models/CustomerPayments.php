<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\CustomerPayments
 *
 * @property-read Booking|null $booking
 * @property-read CaseAndBanks|null $case
 * @property-read Customer|null $customer
 * @method static Builder|CustomerPayments newModelQuery()
 * @method static Builder|CustomerPayments newQuery()
 * @method static Builder|CustomerPayments onlyTrashed()
 * @method static Builder|CustomerPayments query()
 * @method static Builder|CustomerPayments withTrashed()
 * @method static Builder|CustomerPayments withoutTrashed()
 * @mixin Eloquent
 */
class CustomerPayments extends Model
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
