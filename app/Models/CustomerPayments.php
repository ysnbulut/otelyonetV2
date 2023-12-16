<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\CustomerPayments
 *
 * @property-read \App\Models\Booking|null $booking
 * @property-read \App\Models\CaseAndBanks|null $case
 * @property-read \App\Models\Customer|null $customer
 * @method static \Illuminate\Database\Eloquent\Builder|CustomerPayments newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|CustomerPayments newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|CustomerPayments onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|CustomerPayments query()
 * @method static \Illuminate\Database\Eloquent\Builder|CustomerPayments withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|CustomerPayments withoutTrashed()
 * @mixin \Eloquent
 */
class CustomerPayments extends Model
{
	use HasFactory, SoftDeletes;

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
