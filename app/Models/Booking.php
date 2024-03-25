<?php

namespace App\Models;

use App\Settings\PricingPolicySettings;
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
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

/**
 * App\Models\Booking
 *
 * @property-read BookingTotalPrice|null $total_price
 * @property-read Customer|null $customer
 * @property-read Collection<int, Guest> $guests
 * @property-read int|null $guests_count
 * @property-read Collection<int, BookingPayment> $payments
 * @property-read int|null $payments_count
 * @property-read Collection<int, Room> $rooms
 * @property-read int|null $rooms_count
 * @property mixed $channel
 * @property mixed $messages
 * @method static Builder|Booking newModelQuery()
 * @method static Builder|Booking newQuery()
 * @method static Builder|Booking onlyTrashed()
 * @method static Builder|Booking query()
 * @method static Builder|Booking remainingBalance()
 * @method static Builder|Booking stayDurationDay()
 * @method static Builder|Booking stayDurationNight()
 * @method static Builder|Booking withTrashed()
 * @method static Builder|Booking withoutTrashed()
 * @property-read Collection<int, \Spatie\Activitylog\Models\Activity> $activities
 * @property-read int|null $activities_count
 * @property-read int|null $messages_count
 * @property-read Collection<int, \App\Models\BookingNote> $notes
 * @property-read int|null $notes_count
 * @mixin Eloquent
 */
class Booking extends Model
{
	use SoftDeletes, LogsActivity;


	protected $fillable = [
        'booking_code',
		'customer_id',
		'check_in',
		'check_out',
        'channel_id',
        'number_of_rooms',
		'number_of_adults',
		'number_of_children',
	];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['customer_id', 'check_in', 'check_out', 'channel_id', 'number_of_rooms', 'number_of_adults', 'number_of_children']);
        // Chain fluent methods for configuration options
    }

    private static function bookingFormat($booking): array
    {
        $settings = new PricingPolicySettings();
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
            'amount' => $booking->total_price ? $booking->total_price->grand_total : null,
            'amount_formatted' => $booking->total_price ? number_format($booking->total_price->grand_total, 2, '.', ',') . ' '
                . $settings->currency['value'] : null,
            'remaining_balance' => $booking->total_price ? $booking->remainingBalance() : null,
            'remaining_balance_formatted' => $booking->total_price ? number_format($booking->remainingBalance(), 2, '.', ',') . ' ' . $settings->currency['value'] : null,
        ];
    }

	public static function getBookings(): array|\Illuminate\Contracts\Pagination\LengthAwarePaginator|\Illuminate\Pagination\LengthAwarePaginator|\LaravelIdea\Helper\App\Models\_IH_Booking_C
	{

		return self::orderBy('id', 'desc')
			->with(['customer', 'rooms', 'total_price'])
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

    public function channel(): BelongsTo
    {
        return $this->belongsTo(BookingChannel::class, 'channel_id', 'id');
    }

	public function rooms(): BelongsToMany
	{
		return $this->belongsToMany(Room::class, 'booking_rooms', 'booking_id', 'room_id')->withPivot('id', 'number_of_adults', 'number_of_children', 'children_ages')->wherePivotNull('deleted_at');
	}

	public function customer(): BelongsTo
	{
		return $this->belongsTo(Customer::class, 'customer_id', 'id');
	}

	public function scopeRemainingBalance($query)
	{
		$balance = $this->total_price->grand_total - $this->payments()->sum('amount_paid');
		return $balance < 1 ? 0 : $balance;
	}

	public function payments(): HasMany
	{
		return $this->hasMany(BookingPayment::class, 'booking_id', 'id');
	}

	public function total_price(): HasOne
	{
		return $this->hasOne(BookingTotalPrice::class);
	}

    public function notes(): HasMany {
        return $this->hasMany(BookingNote::class, 'booking_id', 'id');
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
		return $checkIn->diffInDays($checkOut) . ' Gece';
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
