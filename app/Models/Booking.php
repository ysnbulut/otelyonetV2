<?php

namespace App\Models;

use App\Settings\GeneralSettings;
use Carbon\Carbon;
use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\Booking
 *
 * @property-read BookingAmounts|null $amount
 * @property-read Customer|null $customer
 * @property-read Collection<int, Guest> $guests
 * @property-read int|null $guests_count
 * @property-read Collection<int, CustomerPayments> $payments
 * @property-read int|null $payments_count
 * @property-read Collection<int, Room> $rooms
 * @property-read int|null $rooms_count
 * @method static Builder|Booking newModelQuery()
 * @method static Builder|Booking newQuery()
 * @method static Builder|Booking onlyTrashed()
 * @method static Builder|Booking query()
 * @method static Builder|Booking remainingBalance()
 * @method static Builder|Booking stayDurationDay()
 * @method static Builder|Booking stayDurationNight()
 * @method static Builder|Booking withTrashed()
 * @method static Builder|Booking withoutTrashed()
 * @mixin Eloquent
 */
class Booking extends Model
{
	use SoftDeletes;


	protected $fillable = [
		'customer_id',
		'check_in',
		'check_out',
		'number_of_adults',
		'number_of_children',
		'payment_status',
	];

    private static function bookingFormat($booking): array
    {
        $settings = new GeneralSettings();
        return [
            'id' => $booking->id,
            'check_in' => Carbon::parse($booking->check_in)->format('d.m.Y'),
            'check_out' => $booking->check_out != NULL ? Carbon::parse($booking->check_out)->format('d.m.Y') : NULL,
            'open_booking' => $booking->check_out === null,
            'customer_id' => $booking->customer->id,
            'customer' => $booking->customer->title,
            'rooms' => $booking->rooms->pluck('name')->implode(', '), // $booking->rooms->pluck('name')->implode(', ')
            'rooms_count' => $booking->rooms->count(),
            'number_of_adults' => $booking->rooms->sum('pivot.number_of_adults'),
            'number_of_children' => $booking->rooms->sum('pivot.number_of_children'),
            'amount' => $booking->amount ? $booking->amount->grand_total : null,
            'amount_formatted' => $booking->amount ? number_format($booking->amount->grand_total, 2, '.', ',') . ' ' . $settings->currency : null,
            'remaining_balance' => $booking->amount ? $booking->remainingBalance() : null,
            'remaining_balance_formatted' => $booking->amount ? number_format($booking->remainingBalance(), 2, '.', ',') . ' ' . $settings->currency : null,
        ];
    }

	public static function getBookings(): array|\Illuminate\Contracts\Pagination\LengthAwarePaginator|\Illuminate\Pagination\LengthAwarePaginator|\LaravelIdea\Helper\App\Models\_IH_Booking_C
	{

		return self::orderBy('id', 'desc')
			->with(['customer', 'rooms', 'amount'])
			->paginate(10)
			->withQueryString()
			->through(fn($booking) => Booking::bookingFormat($booking));
	}

	/**
	 * @param $check_in
	 * @param $check_out
	 * @return array
	 */
	public static function getUnavailableRoomsIds($check_in, $check_out): array
    {
		return Booking::select('id')
			->where(function ($query) use ($check_in, $check_out) {
				$query->where('check_in', '>=', $check_in)
					->where('check_in', '<', $check_out);
			})
			->orWhere(function ($query) use ($check_in, $check_out) {
				$query->where('check_out', '>', $check_in)
					->where('check_out', '<=', $check_out)->orWhereNull('check_out');
			})
			->orWhere(function ($query) use ($check_in, $check_out) {
				$query->where('check_in', '<=', $check_in)
					->where('check_out', '>=', $check_out)->orWhereNull('check_out');
			})->with('rooms')->get()->pluck('rooms')->flatten()->pluck('id')->unique()->toArray();
	}

	public function rooms(): BelongsToMany
	{
		return $this->belongsToMany(Room::class, 'booking_rooms', 'booking_id', 'room_id')->orderByDesc('name')->withPivot('number_of_adults', 'number_of_children');
	}

	public function guests(): BelongsToMany
	{
		return $this->belongsToMany(Guest::class, 'booking_guests', 'booking_id', 'guest_id');
	}

	public function customer(): BelongsTo
	{
		return $this->belongsTo(Customer::class, 'customer_id', 'id');
	}

	public function scopeRemainingBalance($query)
	{
		$balance = $this->amount->grand_total - $this->payments()->sum('amount_paid');
		return $balance < 1 ? 0 : $balance;
	}

	public function payments(): HasMany
	{
		return $this->hasMany(CustomerPayments::class, 'booking_id', 'id');
	}

	public function amount(): HasOne
	{
		return $this->hasOne(BookingAmounts::class);
	}

	public function scopeStayDurationNight(): string
	{
		$checkIn = $this->check_in;
		if ($this->check_out == null) {
			return 'Açık Rezervasyon';
		}
		$checkOut = $this->check_out;
		$checkIn = Carbon::createFromFormat('Y-m-d', $checkIn);
		$checkOut = Carbon::createFromFormat('Y-m-d', $checkOut);
		return $checkIn->diffInDays($checkOut) + 1 . ' Gece';
	}

	public function scopeStayDurationDay(): ?string
	{
		$checkIn = $this->check_in;
		if ($this->check_out == null) {
			return NULL;
		}
		$checkOut = $this->check_out;
		$checkIn = Carbon::createFromFormat('Y-m-d', $checkIn);
		$checkOut = Carbon::createFromFormat('Y-m-d', $checkOut);
		return $checkIn->diffInDays($checkOut) . ' Gün';
	}
}
