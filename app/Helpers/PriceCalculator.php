<?php

namespace App\Helpers;

use App\Models\BookingChannel;
use App\Models\TypeHasView;
use App\Settings\PricingPolicySettings;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Support\Facades\Log;
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
     * @throws \JsonException
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
        if ($this->settings->pricing_currency['value'] !== 'TRY') {
            $kur = $this->doviz->kurAlis($this->settings->pricing_currency['value'], Doviz::TYPE_EFEKTIFALIS);
        } else {
            $kur = 1;
        }
        $panelChannels = BookingChannel::whereIn('code', ['reception', 'agency'])->orderBy('id')->pluck('id')->toArray();
        $receiptChannelId = BookingChannel::where('code', 'reception')->first()->id;
        $agencyChannelId = BookingChannel::where('code', 'agency')->first()->id;
        $bookingPeriod = CarbonPeriod::create($checkIn, $checkOut);
        $priceChannelNames = ['reception', 'agency'];
        return TypeHasView::select('id', 'type_id', 'view_id')
            ->with([
                'unitPrices' => function ($query) use (
                    $checkIn, $checkOut, $numberOfAdults,
                    $numberOfChildren, $panelChannels
                ) {
                    $query
                        ->select('id', 'type_has_view_id', 'season_id', 'booking_channel_id', 'unit_price')
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
                                    ->where('reception', true)
                                    ->orWhere('agency', true)
                                    ->whereDate('start_date', '<=', $checkOut)
                                    ->whereDate('end_date', '>=', $checkIn);
                            },
                        ])
                        ->whereHas('channel');
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
                    $query->whereIn('booking_channel_id', $panelChannels);
                    $query->whereNotNull('booking_channel_id');
                },
            ])
            ->where('id', $id)
            ->get()
            ->map(function ($unit) use ($dates, $kur, &$bookingPeriod, $receiptChannelId, $agencyChannelId, &$priceChannelNames) {
                $bookingPeriodArr = iterator_to_array($bookingPeriod->map(function ($date) {
                    return $date->format('Y-m-d');
                }));
                foreach ($unit->unitPrices as $unitPrice) {
                    if ($unitPrice->season !== null) {
                        $seasonPeriod = CarbonPeriod::create($unitPrice->season->start_date, $unitPrice->season->end_date);
                        $seasonPeriodArr = iterator_to_array($seasonPeriod->map(function ($date) {
                            return $date->format('Y-m-d');
                        }));
                        if ($unitPrice->season->agency) {
                            $intersection = array_intersect($bookingPeriodArr, $seasonPeriodArr);
                            $bookingPeriodArr = array_diff($bookingPeriodArr, $intersection);
                        }
                    }
                }
                if (!empty($bookingPeriodArr)) {
                    $unitPrices = $unit->unitPrices->filter(function ($unitPrice) use ($agencyChannelId) {
                        return $unitPrice->booking_channel_id !== $agencyChannelId ? $unitPrice : false;
                    });
                    $priceChannelNames = ['reception'];
                } else {
                    $unitPrices = $unit->unitPrices;
                }
                $returnData = [];
                foreach ($priceChannelNames as $channelName) {
                    $returnData[$channelName]['id'] = $unit->id;
                    $returnData[$channelName]['type_id'] = $unit->type_id;
                    $returnData[$channelName]['view_id'] = $unit->view_id;
                    $returnData[$channelName]['exchange_rate'] = $kur;
                    $returnData[$channelName]['currency'] = $this->settings->currency['value'];
                    $returnData[$channelName]['daily_prices'] = [];
                    $multiplier = 1;
                    foreach ($unitPrices as $unitPrice) {
                        if ($channelName === 'reception' && $unitPrice->booking_channel_id !== $receiptChannelId) {
                            continue;
                        }

                        if ($channelName === 'agency' && $unitPrice->booking_channel_id !== $agencyChannelId) {
                            continue;
                        }

                        foreach ($dates as $dkey => $date) {
                            $returnData[$channelName]['daily_prices'][$dkey]['date'] = $date->format('Y-m-d');
                            if ($unitPrice->typeHasView->type !== null && count($unitPrice->typeHasView->type->variationsOfGuests) > 0) {
                                if ($this->settings->pricing_policy['value'] === 'person_based') {
                                    $variationGuestsFirst = $unitPrice->typeHasView->type->variationsOfGuests->first();
                                    if ($variationGuestsFirst !== null && $variationGuestsFirst->multiplier !== null) {
                                        $multiplier = $variationGuestsFirst->multiplier->multiplier;
                                    }
                                }
                            }
                            if ($unitPrice->season !== null) {
                                $carbonSeasonStartDate = Carbon::parse($unitPrice->season->start_date);
                                $carbonseasonEndDate = Carbon::parse($unitPrice->season->end_date);
                                if ($date->between($carbonSeasonStartDate, $carbonseasonEndDate)) {
                                    $price = round($unitPrice->unit_price * $kur * $multiplier);
                                    $fprice = number_format($price, 2, '.', ',');
                                    $returnData[$channelName]['daily_prices'][$dkey]['price'] = $price;
                                    $returnData[$channelName]['daily_prices'][$dkey]['fprice'] = $fprice;
                                    $returnData[$channelName]['daily_prices'][$dkey]['fprice_with_currency'] = $fprice . ' ' .
                                        $this->settings->currency['value'];
                                }
                            } else {
                                if (!array_key_exists('price', $returnData[$channelName]['daily_prices'][$dkey]) && $unitPrice->booking_channel_id === $receiptChannelId) {
                                    $price = round($unitPrice->unit_price * $kur * $multiplier);
                                    $fprice = number_format($price, 2, '.', ',');
                                    $returnData[$channelName]['daily_prices'][$dkey]['price'] = $price;
                                    $returnData[$channelName]['daily_prices'][$dkey]['fprice'] = $fprice;
                                    $returnData[$channelName]['daily_prices'][$dkey]['fprice_with_currency'] = $fprice . ' ' .
                                        $this->settings->currency['value'];
                                }
                            }

                        }
                    }
                    $returnData[$channelName]['multiplier'] = $multiplier;
                    $totalPrice = 0;
                    if (count($returnData[$channelName]['daily_prices']) > 0) {
                        foreach ($returnData[$channelName]['daily_prices'] as $key => $dPrice) {
                            if (array_key_exists('price', $dPrice)) {
                                $totalPrice += $dPrice['price'];
                            }
                        }
                    }
                    $ftotalPrice = number_format($totalPrice, 2, '.', ',');
                    $returnData[$channelName]['total_price']['price'] = $totalPrice;
                    $returnData[$channelName]['total_price']['fprice'] = $ftotalPrice;
                    $returnData[$channelName]['total_price']['fprice_with_currency'] = $ftotalPrice . ' ' . $this->settings->currency['value'];
                }
                return $returnData;
            })->first();
    }
}