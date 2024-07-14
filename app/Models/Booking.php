<?php

namespace App\Models;

use App\Observers\BookingObserver;
use Carbon\Carbon;
use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use ShiftOneLabs\LaravelCascadeDeletes\CascadesDeletes;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Models\Activity;
use Spatie\Activitylog\Traits\LogsActivity;
use Sqids\Sqids;

/**
 * App\Models\Booking
 *
 * @property-read Customer|null $customer
 * @property-read Collection<int, Guest> $guests
 * @property-read int|null $guests_count
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
 * @property-read Collection<int, Activity> $activities
 * @property-read int|null $activities_count
 * @property-read int|null $messages_count
 * @property-read Collection<int, \App\Models\BookingNote> $notes
 * @property-read int|null $notes_count
 * @property-read \App\Models\ReasonForCancellation|null $cancelReason
 * @property mixed $check_out
 * @property mixed $documents
 * @method static Builder|Booking filter(array $filters)
 * @mixin Eloquent
 */
class Booking extends Model
{
    use SoftDeletes, LogsActivity, CascadesDeletes;


    protected $fillable = [
        'booking_code',
        'customer_id',
        'check_in',
        'check_out',
        'channel_id',
        'number_of_rooms',
        'number_of_adults',
        'number_of_children',
        'calendar_colors',
    ];

    protected $casts = [
        'calendar_colors' => 'json',
    ];

    protected $cascadeDeletes = ['rooms', 'cMBooking', 'notes', 'tasks', 'cancelReason'];

    protected static function boot(): void
    {
        parent::boot();
        self::observe(BookingObserver::class);
    }

    /**
     * @param $check_in
     * @param $check_out
     * @return array
     */
    public static function getUnavailableRoomsIds($check_in, $check_out): array
    {
        return self::select('id')
            ->whereHas('rooms', function ($query) use ($check_in, $check_out) {
                $query->where(function ($query) use ($check_in, $check_out) {
                    $query->where(function ($query) use ($check_in, $check_out) {
                        $query->where('check_in', '<', $check_out)
                            ->where('check_out', '>', $check_in);
                    });
                });
            })
            ->with(['rooms' => function ($query) use ($check_in) {
                $query->whereHas('booking_guests', function ($query) use ($check_in) {
                    $query->where('status', '!=', 'check_out')->orWhere(function ($query) use ($check_in) {
                        $query->where('status', 'check_out')->where('check_out_date', '>', $check_in);
                    });
                })->orWhereDoesntHave('booking_guests');
            }])
            ->get()
            ->pluck('rooms')
            ->flatten()
            ->pluck('room_id')
            ->unique()
            ->toArray();
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['customer_id', 'channel_id', 'number_of_rooms', 'number_of_adults', 'number_of_children']);
    }

    public function channel(): BelongsTo
    {
        return $this->belongsTo(BookingChannel::class, 'channel_id', 'id');
    }

    public function cMBooking(): HasOne
    {
        return $this->hasOne(CMBooking::class, 'booking_id', 'id');
    }

    public function documents(): HasManyThrough
    {
        return $this->hasManyThrough(
            Document::class,
            BookingRoom::class,
            'booking_id', // Foreign key on BookingRoom table...
            'unit_id', // Foreign key on Document table...
            'id', // Local key on Booking table...
            'id' // Local key on BookingRoom table...
        );
    }

    public function rooms(): hasMany
    {
        return $this->hasMany(BookingRoom::class);
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

    public function tasks(): MorphMany
    {
        return $this->morphMany(Task::class, 'taskable');
    }

    public function notes(): HasMany
    {
        return $this->hasMany(BookingNote::class, 'booking_id', 'id');
    }

    public function cancelReason(): HasOne
    {
        return $this->hasOne(ReasonForCancellation::class, 'booking_id', 'id');
    }

    public function scopeStayDurationNight(): string
    {
        $checkIn = $this->rooms->min('check_in');
        $checkOut = $this->rooms->max('check_out');
        $checkIn = Carbon::createFromFormat('Y-m-d H:i:s', $checkIn);
        $checkOut = Carbon::createFromFormat('Y-m-d H:i:s', $checkOut);
        return $checkIn->diffInDays($checkOut, false) + 1 . ' Gece';
    }

    public function scopeStayDurationDay(): ?string
    {
        $checkIn = $this->rooms->min('check_in');
        $checkOut = $this->rooms->max('check_out');
        $checkIn = Carbon::createFromFormat('Y-m-d H:i:s', $checkIn);
        $checkOut = Carbon::createFromFormat('Y-m-d H:i:s', $checkOut);
        return $checkIn->diffInDays($checkOut, false) . ' Gün';
    }

    public function scopeFilter($query, array $filters): void
    {
        $query
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query
                        ->whereHas('customer', function ($query) use ($search) {
                            $query->where('title', 'like', '%' . $search . '%')
                                ->orWhere('tax_number', 'like', '%' . $search . '%')
                                ->orWhere('phone', 'like', '%' . $search . '%')
                                ->orWhere('email', 'like', '%' . $search . '%');
                        });
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
