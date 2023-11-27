<?php

namespace App\Models;

use App\Settings\GeneralSettings;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Teknomavi\Tcmb\Doviz;
use function number_format;

/**
 * App\Models\TypeHasView
 *
 * @property-read mixed $type_and_view_name
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Room> $rooms
 * @property-read int|null $rooms_count
 * @property-read \App\Models\RoomType|null $type
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\UnitPriceRoomTypeAndView> $unitPrices
 * @property-read int|null $unit_prices_count
 * @property-read \App\Models\RoomView|null $view
 * @method static \Illuminate\Database\Eloquent\Builder|TypeHasView availableTypes()
 * @method static \Illuminate\Database\Eloquent\Builder|TypeHasView newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|TypeHasView newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|TypeHasView onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|TypeHasView singlePriceCalculator($id, $checkIn, $checkOut, $numberOfAdults, $numberOfChildren)
 * @method static \Illuminate\Database\Eloquent\Builder|TypeHasView groupriceCalculator($id, $checkIn, $checkOut)
 * @method static \Illuminate\Database\Eloquent\Builder|TypeHasView query()
 * @method static \Illuminate\Database\Eloquent\Builder|TypeHasView withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|TypeHasView withoutTrashed()
 * @mixin \Eloquent
 */
class TypeHasView extends Model
{
	use HasFactory, SoftDeletes;

	protected $fillable = ['type_id', 'view_id'];

	public function rooms()
	{
		return $this->hasMany(Room::class, 'type_has_view_id', 'id');
	}

	public function type()
	{
		return $this->belongsTo(RoomType::class, 'type_id', 'id', 'type_has_view_id');
	}

	public function view()
	{
		return $this->belongsTo(RoomView::class, 'view_id');
	}

	public function getTypeAndViewNameAttribute()
	{
		return $this->type->name . ' ' . $this->view->name;
	}

	public function unitPrices()
	{
		return $this->hasMany(UnitPriceRoomTypeAndView::class);
	}

	public function scopeAvailableRoomForTypeHasView($query, $check_in, $check_out) {
		$unavailableRooms = Booking::getUnavailableRoomsIds($check_in, $check_out);
		return $query->with(['rooms' => function($query) use($unavailableRooms) {
			$query->whereNotIn('id', $unavailableRooms);
		}]);
	}

	public function scopeSinglePriceCalculator($query, $id, $checkIn, $checkOut, $numberOfAdults, $numberOfChildren)
	{
		$settings = new GeneralSettings();
		$doviz = new Doviz();
		return $query
			->select('id', 'type_id', 'view_id')
			->with([
				'unitPrices' => function ($query) use ($checkIn, $checkOut, $numberOfAdults, $numberOfChildren, $settings) {
					$query
						->select('id', 'type_has_view_id', 'season_id', 'unit_price')
						->whereHas('season', function ($query) use ($checkIn, $checkOut) {
							$query
								->where(function ($query) use ($checkIn, $checkOut) {
									$query->where('start_date', '>=', $checkIn)->where('start_date', '<=', $checkOut);
								})
								->orWhere(function ($query) use ($checkIn, $checkOut) {
									$query->where('end_date', '>=', $checkIn)->where('end_date', '<=', $checkOut);
								})
								->orWhere(function ($query) use ($checkIn, $checkOut) {
									$query->where('start_date', '<', $checkIn)->where('end_date', '>', $checkOut);
								});
						})
						->with([
							'season' => function ($query) use ($checkIn, $checkOut) {
								$query
									->select('id', 'start_date', 'end_date')
									->where('start_date', '<=', $checkOut)
									->where('end_date', '>=', $checkIn);
							},
						]);
					$query->with([
						'roomType.possibilitiesOfGuests' => function ($query) use ($numberOfAdults, $numberOfChildren) {
							$query
								->select('id', 'room_type_id', 'number_of_adults', 'number_of_children')
								->with(['possibilitiesMultipliers'])
								->where('number_of_adults', $numberOfAdults)
								->where('number_of_children', $numberOfChildren);
						},
					]);
					$query->orWhere('season_id', null);
				},
			])
			->where('id', $id)
			->get()
			->map(function ($unit) use ($checkIn, $checkOut, $settings, $doviz) {
				$carbonCheckIn = new Carbon($checkIn);
				$carbonCheckOut = new Carbon($checkOut);
				$totalPrice = 0;
				$offSeasonDays = $carbonCheckIn->diffInDays($carbonCheckOut);
				$offSeasonPrice = 0;
				$multiplier = 1;
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
					if ($unitPrice->roomType != null && count($unitPrice->roomType->possibilitiesOfGuests) > 0) {
						if ($settings->pricing_policy == 'person_based') {
							$multiplier = ($unitPrice->roomType->possibilitiesOfGuests->first() === null
								? 1
								: $unitPrice->roomType->possibilitiesOfGuests->first()->possibilitiesMultipliers !== null)
								? $unitPrice->roomType->possibilitiesOfGuests->first()->possibilitiesMultipliers->multiplier
								: 1;
						} else {
							$multiplier = 1;
						}
					} else {
						$multiplier = 1;
					}
				}
				$unit->totalPrice = $totalPrice + $offSeasonDays * $offSeasonPrice;
				$unit->totalPrice = $unit->totalPrice * $multiplier;
				$unit->multiplier = $multiplier;

				if ($settings->pricing_currency != 'TRY') {
					if ($unit->totalPrice > 0) {
						$kur = $doviz->kurAlis($settings->pricing_currency, Doviz::TYPE_EFEKTIFALIS);
						$unit->totalPrice = number_format($unit->totalPrice * $kur, 2, '.', '');
					}
				}

				return [
					'id' => $unit->id,
					'type_id' => $unit->type_id,
					'view_id' => $unit->view_id,
					'total_price' => number_format($unit->totalPrice, 2, '.', ','),
					'total_price_formatter' => number_format($unit->totalPrice, 2, '.', ',') . ' ' . $settings->currency,
					'multiplier' => $unit->multiplier,
				];
			});
	}

	public function scopeGroupPriceCalculator($query, $id, $checkIn, $checkOut)
	{
		$settings = new GeneralSettings();
		$doviz = new Doviz();
		return $query
			->select('id', 'type_id', 'view_id')
			->with([
				'unitPrices' => function ($query) use ($checkIn, $checkOut, $settings) {
					$query
						->select('id', 'type_has_view_id', 'season_id', 'unit_price')
						->whereHas('season', function ($query) use ($checkIn, $checkOut) {
							$query
								->where(function ($query) use ($checkIn, $checkOut) {
									$query->where('start_date', '>=', $checkIn)->where('start_date', '<=', $checkOut);
								})
								->orWhere(function ($query) use ($checkIn, $checkOut) {
									$query->where('end_date', '>=', $checkIn)->where('end_date', '<=', $checkOut);
								})
								->orWhere(function ($query) use ($checkIn, $checkOut) {
									$query->where('start_date', '<', $checkIn)->where('end_date', '>', $checkOut);
								});
						})
						->with([
							'season' => function ($query) use ($checkIn, $checkOut) {
								$query
									->select('id', 'start_date', 'end_date')
									->where('start_date', '<=', $checkOut)
									->where('end_date', '>=', $checkIn);
							},
						]);
					$query->with([
						'roomType.possibilitiesOfGuests' => function ($query) {
							$query
								->select('id', 'room_type_id', 'number_of_adults', 'number_of_children')
								->with(['possibilitiesMultipliers']);
						},
					]);
					$query->orWhere('season_id', null);
				},
			])
			->where('id', $id)
			->get()
			->map(function ($unit) use ($checkIn, $checkOut, $settings, $doviz) {
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
					if ($unitPrice->roomType != null && count($unitPrice->roomType->possibilitiesOfGuests) > 0) {
						if ($settings->pricing_policy == 'person_based') {
							foreach ($unitPrice->roomType->possibilitiesOfGuests as $possibilityOfGuest) {
								if($possibilityOfGuest === null) {
									$multipliers[] = ['text' => 'Varyasyonsuz oda fiyatı', 'multiplier' => 1];
								} else {
									if($possibilityOfGuest->possibilitiesMultipliers === null) {
										$multipliers[] = ['text' => 'Varyasyon için çarpan girilmemiş oda fiyatı', 'multiplier' => 1];
									} else {
										$multipliers[] = ['text' => $possibilityOfGuest->number_of_adults . ' Yetişkin ' . $possibilityOfGuest->number_of_children . ' Çocuk', 'multiplier' => $possibilityOfGuest->possibilitiesMultipliers->multiplier];
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
					if ($settings->pricing_currency != 'TRY') {
						if ($mTotalPrice > 0) {
							$kur = $doviz->kurAlis($settings->pricing_currency, Doviz::TYPE_EFEKTIFALIS);
							$mTotalPrice = number_format($mTotalPrice * $kur, 2, '.', '');
						}
					}
					$prices[] = [
						'text' => $multiplier['text'],
						'multiplier' => $multiplier['multiplier'],
						'total_price' => number_format($mTotalPrice, 2, '.', ','),
						'total_price_formatter' => number_format($mTotalPrice, 2, '.', ',') . ' ' . $settings->currency,
					];
				}



				return [
					'id' => $unit->id,
					'type_id' => $unit->type_id,
					'view_id' => $unit->view_id,
					'prices' => $prices,
				];
			});
	}
	public function scopeAvailableTypes($query)
	{
		return $query->whereHas('rooms', function ($query) {
			$query->where('is_available', true);
		});
	}
}
