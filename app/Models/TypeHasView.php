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

    public function scopeGroupPriceCalculator($query, $id, $checkIn, $checkOut)
    {
        $settings = new PricingPolicySettings();
        $doviz = new Doviz();
        return $query->select('id', 'type_id', 'view_id')->with(['unitPrices' => function ($query) use ($checkIn, $checkOut) {
                $query->select('id', 'type_has_view_id', 'season_id', 'unit_price')->whereHas('season', function ($query) use ($checkIn, $checkOut) {
                        $query->where(function ($query) use ($checkIn, $checkOut) {
                                $query->where('start_date', '>=', $checkIn)->where('start_date', '<=', $checkOut);
                            })->orWhere(function ($query) use ($checkIn, $checkOut) {
                                $query->where('end_date', '>=', $checkIn)->where('end_date', '<=', $checkOut);
                            })->orWhere(function ($query) use ($checkIn, $checkOut) {
                                $query->where('start_date', '<', $checkIn)->where('end_date', '>', $checkOut);
                            });
                    })->with(['season' => function ($query) use ($checkIn, $checkOut) {
                        $query->select('id', 'start_date', 'end_date')->where('start_date', '<=', $checkOut)->where('end_date', '>=', $checkIn);
                    },]);
                $query->with(['typeHasView.type.variationsOfGuests' => function ($query) {
                    $query->select('id', 'room_type_id', 'number_of_adults', 'number_of_children')->with(['multiplier']);
                },]);
                $query->orWhere('season_id', null);
            },])->where('id', $id)->get()->map(function ($unit) use ($checkIn, $checkOut, $doviz, $settings) {
                $carbonCheckIn = new Carbon($checkIn);
                $carbonCheckOut = new Carbon($checkOut);
                $totalPrice = 0;
                $offSeasonDays = $carbonCheckIn->diffInDays($carbonCheckOut);
                $offSeasonPrice = 0;
                $multipliers = [];
                foreach ($unit->unitPrices as $unitPrice) {
                    if ($unitPrice->season !== null) {
                        $carbonSeasonStartDate = new Carbon($unitPrice->season->start_date);
                        $carbonseasonEndDate = new Carbon($unitPrice->season->end_date);
                        $seasonStartDate = $carbonSeasonStartDate->greaterThan($carbonCheckIn) ? $carbonSeasonStartDate : $carbonCheckIn;
                        $seasonEndDate = $carbonseasonEndDate->lessThan($carbonCheckOut) ? $carbonseasonEndDate : $carbonCheckOut;
                        $numberOfDays = $seasonStartDate->diffInDays($seasonEndDate);
                        $offSeasonDays -= $numberOfDays;
                        $totalPrice += $numberOfDays * $unitPrice->unit_price;
                    } else {
                        $offSeasonPrice = $unitPrice->unit_price;
                    }
                    if ($unitPrice->typeHasView->type != null && count($unitPrice->typeHasView->type->variationsOfGuests) > 0) {
                        if ($settings->pricing_policy['value'] == 'person_based') {
                            foreach ($unitPrice->typeHasView->type->variationsOfGuests as $variationsOfGuest) {
                                if ($variationsOfGuest === null) {
                                    $multipliers[] = ['text' => 'Varyasyonsuz oda fiyatı', 'multiplier' => 1];
                                } else {
                                    if ($variationsOfGuest->multiplier === null) {
                                        $multipliers[] = ['text' => 'Varyasyon için çarpan girilmemiş oda fiyatı', 'multiplier' => 1];
                                    } else {
                                        $multipliers[] = ['text' => $variationsOfGuest->number_of_adults . ' Yetişkin ' . $variationsOfGuest->number_of_children . ' Çocuk', 'multiplier' => $variationsOfGuest->multiplier->multiplier];
                                    }
                                }
                            }
                        } else {
                            $multipliers = [['text' => 'Oda bazlı fiyat', 'multiplier' => 1]];
                        }
                    } else {
                        $multipliers = [['text' => 'Varyasyonsuz oda fiyatı', 'multiplier' => 1]];
                    }
                }
                $prices = [];
                foreach ($multipliers as $multiplier) {
                    $mTotalPrice = ($totalPrice + $offSeasonDays * $offSeasonPrice) * $multiplier['multiplier'];
                    if ($settings->pricing_currency['value'] != 'TRY') {
                        if ($mTotalPrice > 0) {
                            $kur = $doviz->kurAlis($settings->pricing_currency['value'], Doviz::TYPE_EFEKTIFALIS);
                            $mTotalPrice = number_format($mTotalPrice * $kur, 2, '.', '');
                        }
                    }
                    $prices[] = ['text' => $multiplier['text'], 'multiplier' => $multiplier['multiplier'], 'total_price' => number_format($mTotalPrice, 2, '.', ','), 'total_price_formatter' => number_format($mTotalPrice, 2, '.', ',') . ' ' . $settings->currency['value'],];
                }


                return ['id' => $unit->id, 'type_id' => $unit->type_id, 'view_id' => $unit->view_id, 'prices' => $prices,];
            });
    }

    public function scopeAvailableTypes($query)
    {
        return $query->whereHas('rooms', function ($query) {
            $query->where('is_available', true);
        });
    }
}
