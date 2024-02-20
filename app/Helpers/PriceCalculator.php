<?php

namespace App\Helpers;

use App\Models\TypeHasView;
use App\Settings\PricingPolicySettings;
use Carbon\Carbon;
use Teknomavi\Tcmb\Doviz;

class PriceCalculator
{
    protected PricingPolicySettings $settings;
    protected Doviz $doviz;

    public function __construct()
    {
        $settings = new PricingPolicySettings();
        $doviz = new Doviz();
        $this->settings = $settings;
        $this->doviz = $doviz;
    }
    public function getNormalPrices($id, $checkIn, $checkOut, $numberOfAdults, $numberOfChildren, $chilrenAges = null)
    {
        if(!empty($chilrenAges)) {
            $i = 1;
            foreach ($chilrenAges as $age){
                if($age >= $this->settings->free_child_or_baby_max_age['value']){
                    $numberOfAdults++;
                    $numberOfChildren--;
                } else {
                    if($i <= $this->settings->free_child_or_baby_max_number['value']) {
                        $numberOfChildren--;
                        $i++;
                    }
                }
            }
        }
        return TypeHasView::select('id', 'type_id', 'view_id')
            ->with([
                'unitPrices' => function ($query) use ($checkIn, $checkOut, $numberOfAdults, $numberOfChildren) {
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
                        'typeHasView.type.variationsOfGuests' => function ($query) use ($numberOfAdults,
                            $numberOfChildren) {
                            $query
                                ->select('id', 'room_type_id', 'number_of_adults', 'number_of_children')
                                ->with(['multiplier'])
                                ->where('number_of_adults', $numberOfAdults)
                                ->where('number_of_children', $numberOfChildren);
                        },
                    ]);
                    $query->orWhere('season_id', null);
                },
            ])
            ->where('id', $id)
            ->get()
            ->map(function ($unit) use ($checkIn, $checkOut) {
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
                    if ($unitPrice->typeHasView->type != null && count($unitPrice->typeHasView->type->variationsOfGuests) > 0) {
                        if ($this->settings->pricing_policy['value'] == 'person_based') {
                            $multiplier = ($unitPrice->typeHasView->type->variationsOfGuests->first() === null
                                ? 1
                                : $unitPrice->typeHasView->type->variationsOfGuests->first()->multiplier !== null)
                                ? $unitPrice->typeHasView->type->variationsOfGuests->first()->multiplier->multiplier
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

                if ($this->settings->pricing_currency['value'] != 'TRY') {
                    if ($unit->totalPrice > 0) {
                        $kur = $this->doviz->kurAlis($this->settings->pricing_currency['value'], Doviz::TYPE_EFEKTIFALIS);
                        $unit->totalPrice = number_format($unit->totalPrice * $kur, 2, '.', '');
                    }
                }
                return [
                    'id' => $unit->id,
                    'type_id' => $unit->type_id,
                    'view_id' => $unit->view_id,
                    'total_price' => number_format($unit->totalPrice, 2, '.', ','),
                    'total_price_formatter' => number_format($unit->totalPrice, 2, '.', ',') . ' ' .
                        $this->settings->currency['value'],
                    'multiplier' => $unit->multiplier,
                ];
            });
    }
}