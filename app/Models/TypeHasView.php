<?php

namespace App\Models;

use App\Settings\PricingPolicySettings;
use Carbon\Carbon;
use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Teknomavi\Tcmb\Doviz;
use function number_format;

/**
 * App\Models\TypeHasView
 *
 * @property-read mixed $type_and_view_name
 * @property-read Collection<int, Room> $rooms
 * @property-read int|null $rooms_count
 * @property-read RoomType|null $type
 * @property-read Collection<int, UnitPrice > $unitPrices
 * @property-read int|null $unit_prices_count
 * @property-read RoomView|null $view
 * @method static Builder|TypeHasView availableRoomForTypeHasView($check_in, $check_out)
 * @method static Builder|TypeHasView availableTypes()
 * @method static Builder|TypeHasView groupPriceCalculator($id, $checkIn, $checkOut)
 * @method static Builder|TypeHasView newModelQuery()
 * @method static Builder|TypeHasView newQuery()
 * @method static Builder|TypeHasView onlyTrashed()
 * @method static Builder|TypeHasView query()
 * @method static Builder|TypeHasView singlePriceCalculator($id, $checkIn, $checkOut, $numberOfAdults, $numberOfChildren)
 * @method static Builder|TypeHasView withTrashed()
 * @method static Builder|TypeHasView withoutTrashed()
 * @property-read Collection<int, \App\Models\UnitPrice> $unitPrices
 * @mixin Eloquent
 */
class TypeHasView extends Model
{
    protected $table = 'type_has_views';

    protected $fillable = ['type_id', 'view_id'];

    public function rooms(): HasMany
    {
        return $this->hasMany(Room::class, 'type_has_view_id', 'id');
    }

    public function type(): BelongsTo
    {
        return $this->belongsTo(RoomType::class, 'type_id', 'id', 'type_has_view_id');
    }

    public function view(): BelongsTo
    {
        return $this->belongsTo(RoomView::class, 'view_id');
    }

    public function getTypeAndViewNameAttribute(): string
    {
        return $this->type->name . ' ' . $this->view->name;
    }

    public function unitPrices(): HasMany
    {
        return $this->hasMany(UnitPrice::class);
    }

    public function scopeAvailableRoomForTypeHasView($query, $check_in, $check_out)
    {
        $unavailableRooms = Booking::getUnavailableRoomsIds($check_in, $check_out);
        return $query->with(['rooms' => function ($query) use ($unavailableRooms) {
            $query->whereNotIn('id', $unavailableRooms);
        }]);
    }

    public function scopeAvailableTypes($query)
    {
        return $query->whereHas('rooms', function ($query) {
            $query->where('is_available', true);
        });
    }
}
