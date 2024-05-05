<?php

namespace App\Helpers;

use App\Models\TypeHasView;
use App\Settings\PricingPolicySettings;
use Carbon\Carbon;
use Teknomavi\Tcmb\Doviz;
use Teknomavi\Tcmb\Exception\UnknownCurrencyCode;
use Teknomavi\Tcmb\Exception\UnknownPriceType;

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

    /**
     * @throws UnknownCurrencyCode
     * @throws UnknownPriceType
     */
    public function prices($id, $checkIn, $checkOut, $numberOfAdults, $numberOfChildren, $chilrenAges = null)
    {
        if (!empty($chilrenAges)) {
            $i = 1;
            foreach ($chilrenAges as $age) {
                if ($age >= $this->settings->free_child_or_baby_max_age['value']) {
                    $numberOfAdults++;
                    $numberOfChildren--;
                } else {
                    if ($i <= $this->settings->free_child_or_baby_max_number['value']) {
                        $numberOfChildren--;
                        $i++;
                    }
                }
            }
        }
        $helper = new Helper();
        $dates = $helper->datesBetween($checkIn, $checkOut, true);
        if ($this->settings->pricing_currency['value'] != 'TRY') {
            $kur = $this->doviz->kurAlis($this->settings->pricing_currency['value'], Doviz::TYPE_EFEKTIFALIS);
        } else {
            $kur = 1;
        }
        return TypeHasView::select('id', 'type_id', 'view_id')
            ->with([
                'unitPrices' => function ($query) use (
                    $checkIn, $checkOut, $dates, $numberOfAdults,
                    $numberOfChildren, $kur
                ) {
                    $query
                        ->select('id', 'type_has_view_id', 'season_id', 'unit_price')
                        ->whereHas('season', function ($query) use ($checkIn, $checkOut) {
                            $query
                                ->where(function ($query) use ($checkIn, $checkOut) {
                                    $query->whereDate('start_date', '>=', $checkIn)->whereDate('start_date', '<=',
                                        $checkOut);
                                })
                                ->orWhere(function ($query) use ($checkIn, $checkOut) {
                                    $query->whereDate('end_date', '>=', $checkIn)->whereDate('end_date', '<=', $checkOut);
                                })
                                ->orWhere(function ($query) use ($checkIn, $checkOut) {
                                    $query->whereDate('start_date', '<', $checkIn)->whereDate('end_date', '>', $checkOut);
                                });
                        })
                        ->with([
                            'season' => function ($query) use ($checkIn, $checkOut) {
                                $query
                                    ->select('id', 'start_date', 'end_date')
                                    ->whereDate('start_date', '<=', $checkOut)
                                    ->whereDate('end_date', '>=', $checkIn);
                            },
                        ]);
                    $query->with([
                        'typeHasView.type.variationsOfGuests' => function ($query) use (
                            $numberOfAdults,
                            $numberOfChildren
                        ) {
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
            ->map(function ($unit) use ($dates, $kur, $checkIn, $checkOut) {
                $returnData['id'] = $unit->id;
                $returnData['type_id'] = $unit->type_id;
                $returnData['view_id'] = $unit->view_id;
                $returnData['exchange_rate'] = $kur;
                $returnData['currency'] = $this->settings->currency['value'];
                $returnData['daily_prices'] = [];
                $multiplier = 1;
                foreach ($unit->unitPrices as $ukey => $unitPrice) {
                    foreach ($dates as $dkey => $date) {
                        $returnData['daily_prices'][$dkey]['date'] = $date->format('Y-m-d');
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
                        if ($unitPrice->season !== null) {
                            $carbonSeasonStartDate = Carbon::parse($unitPrice->season->start_date);
                            $carbonseasonEndDate = Carbon::parse($unitPrice->season->end_date);
                            if ($date->between($carbonSeasonStartDate, $carbonseasonEndDate)) {
                                $price = round($unitPrice->unit_price * $kur * $multiplier);
                                $fprice = number_format($price, 2, '.', ',');
                                $returnData['daily_prices'][$dkey]['price'] = $price;
                                $returnData['daily_prices'][$dkey]['fprice'] = $fprice;
                                $returnData['daily_prices'][$dkey]['fprice_with_currency'] = $fprice . ' ' .
                                    $this->settings->currency['value'];
                            }
                        } else {
                            if (!array_key_exists('price', $returnData['daily_prices'][$dkey])) {
                                $price = round($unitPrice->unit_price * $kur * $multiplier);
                                $fprice = number_format($price, 2, '.', ',');
                                $returnData['daily_prices'][$dkey]['price'] = $price;
                                $returnData['daily_prices'][$dkey]['fprice'] = $fprice;
                                $returnData['daily_prices'][$dkey]['fprice_with_currency'] = $fprice . ' ' .
                                    $this->settings->currency['value'];
                            }
                        }

                    }
                }
                $returnData['multiplier'] = $multiplier;
                $totalPrice = 0;
                $returnData['test'] = $returnData['daily_prices'];
                if (count($returnData['daily_prices']) > 0) {
                    foreach ($returnData['daily_prices'] as $key => $dPrice) {
                        if (array_key_exists('price', $dPrice)) {
                            $totalPrice += $dPrice['price'];
                        }
                    }
                }
                $ftotalPrice = number_format($totalPrice, 2, '.', ',');
                $returnData['total_price']['price'] = $totalPrice;
                $returnData['total_price']['fprice'] = $ftotalPrice;
                $returnData['total_price']['fprice_with_currency'] = $ftotalPrice . ' ' . $this->settings->currency['value'];
                return $returnData;
            });
    }
}