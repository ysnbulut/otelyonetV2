<?php

namespace App\Observers;

use App\Jobs\ChannelManager\UnitPriceJob;
use App\Models\BookingChannel;
use App\Models\Season;
use Carbon\CarbonPeriod;

class SeasonObserver
{
    public function created(Season $season): void
    {

    }

    public function updating(Season $season): void
    {
        //TODO: Activity Log Eklenecek
        $original = $season->getOriginal();
        $changes = $season->getDirty();
        $oldPeriod = CarbonPeriod::create($original['start_date'], $original['end_date']);
        $oldDates = iterator_to_array($oldPeriod->map(function ($date) {
            return $date->format('Y-m-d');
        }));
        $webChannelId = BookingChannel::where('code', 'web')->first()->id;
        $receptionChannelId = BookingChannel::where('code', 'reception')->first()->id;
        $agencyChannelId = BookingChannel::where('code', 'agency')->first()->id;
        $activedHRChannels = BookingChannel::where('active', true)->whereNotIn('code', ['web', 'reception', 'agency', 'online'])->pluck('id');
        if (array_key_exists('web', $changes) || array_key_exists('reception', $changes) || array_key_exists('agency', $changes) || array_key_exists('channels', $changes)) {
            $season->unitPrices->each(function ($unitPrice) use ($original, $changes, $webChannelId, $receptionChannelId, $agencyChannelId, $activedHRChannels) {
                if (array_key_exists('web', $changes) && $original['web'] && !$changes['web'] && $unitPrice->booking_channel_id === $webChannelId) {
                    $unitPrice->delete();
                }
                if (array_key_exists('reception', $changes) && $original['reception'] && !$changes['reception'] && $unitPrice->booking_channel_id === $receptionChannelId) {
                    $unitPrice->delete();
                }
                if (array_key_exists('agency', $changes) && $original['agency'] && !$changes['agency'] && $unitPrice->booking_channel_id === $agencyChannelId) {
                    $unitPrice->delete();
                }
                if (array_key_exists('channels', $changes) && $original['channels'] && !$changes['channels'] && in_array($unitPrice->booking_channel_id, $activedHRChannels->toArray())) {
                    $unitPrice->delete();
                }
            });
        }
        if ($original['channels']) {
            if (array_key_exists('channels', $changes)) {
                $basePricePeriod = [
                    'start_date' => min($oldDates),
                    'end_date' => max($oldDates),
                ];
                $season->unitPrices->each(function ($unitPrice) use ($basePricePeriod, $activedHRChannels) {
                    if (in_array($unitPrice->booking_channel_id, $activedHRChannels->toArray())) {
                        $roomChannelsBasePrice = $unitPrice->typeHasView->unitPrices->filter(function ($value) {
                            return $value->season_id === null && $value->booking_channel_id === null;
                        })->first();
                        if ($roomChannelsBasePrice !== null) {
                            //KanalYöneticisi kanalları kapandı ise $basePricePeriod için $roomChannelsBasePrice baz sezon fiyatı gönderilecek
                            UnitPriceJob::dispatch($unitPrice, $basePricePeriod['start_date'], $basePricePeriod['end_date'], $roomChannelsBasePrice->unit_price)
                                ->onQueue('price');
                        }

                    }
                });

            } else {
                if (array_key_exists('end_date', $changes)) {
                    if (array_key_exists('start_date', $changes)) {
                        $cStartDate = $changes['start_date'];
                    } else {
                        $cStartDate = $original['start_date'];
                    }
                    $newPeriod = CarbonPeriod::create($cStartDate, $changes['end_date']);
                    $newDates = iterator_to_array($newPeriod->map(function ($date) {
                        return $date->format('Y-m-d');
                    }));
                    $intersection = array_intersect($newDates, $oldDates);
                    $difference = array_diff($newDates, $oldDates);
                    if (!empty($difference)) {
                        $differencePeriod = [
                            'start_date' => min($difference),
                            'end_date' => max($difference),
                        ];
                    } else {
                        $differencePeriod = [];
                    }
                    if (count($oldDates) === count($newDates)) {
                        if (!empty($difference)) {
                            $newPeriodInterDiff = array_diff($newDates, $intersection);
                            $addSeasonForNewPeriod = [
                                'start_date' => min($newPeriodInterDiff),
                                'end_date' => max($newPeriodInterDiff),
                            ];
                            $newPeriodDiffDiff = array_diff($newDates, $difference);
                            $addSeasonForDiffPeriod = [
                                'start_date' => min($newPeriodDiffDiff),
                                'end_date' => max($newPeriodDiffDiff),
                            ];
                            //$addSeasonForDiffPeriod için baz fiyat $addSeasonForNewPeriod için varolan fiyat gönderilecek
                            $season->unitPrices->each(function ($unitPrice) use ($addSeasonForDiffPeriod, $activedHRChannels, $addSeasonForNewPeriod) {
                                //burda birden fazla kanala varolan fiyatlar gönderilecek.. Kanalları çekebilmek için yaptık
                                //$addSeasonForNewPeriod varolan sezon fiyatını gönder.
                                if (in_array($unitPrice->booking_channel_id, $activedHRChannels->toArray())) {

                                    UnitPriceJob::dispatch($unitPrice, $addSeasonForNewPeriod['start_date'], $addSeasonForNewPeriod['end_date'], $unitPrice->unit_price)->onQueue('price');

                                    $roomChannelsBasePrice = $unitPrice->typeHasView->unitPrices->filter(function ($value) {
                                        return $value->season_id === null && $value->booking_channel_id === null;
                                    })->first();
                                    if (($roomChannelsBasePrice !== null)) {
                                        //$addSeasonForDiffPeriod için $roomChannelsBasePrice baz sezon fiyatı gönderilecek
                                        UnitPriceJob::dispatch($unitPrice, $addSeasonForDiffPeriod['start_date'], $addSeasonForDiffPeriod['end_date'], $roomChannelsBasePrice->unit_price)
                                            ->onQueue('price');
                                    }
                                }
                            });
                        }
                    } elseif (min($newDates) === min($oldDates) && max($newDates) >= max($oldDates)) {
                        if (!empty($difference)) {
                            //UZATTIK SEZONU UZATTIK
                            //$differencePeriod var olan sezon fiyatı gönderilecek
                            $season->unitPrices->each(function ($unitPrice) use ($differencePeriod, $activedHRChannels) {
                                if (in_array($unitPrice->booking_channel_id, $activedHRChannels->toArray())) {
                                    //burda birden fazla kanala varolan fiyatlar gönderilecek.. Kanalları çekebilmek için yaptık
                                    //$differencePeriod varolan sezon fiyatını gönder.
                                    UnitPriceJob::dispatch($unitPrice, $differencePeriod['start_date'], $differencePeriod['end_date'], $unitPrice->unit_price)->onQueue('price');
                                }
                            });
                        }
                    } elseif (min($newDates) === min($oldDates) && max($newDates) <= max($oldDates)) {
                        if (!empty($difference)) {
                            //Kısalttık SEZONU Kısalttık
                            //$differencePeriod var olan sezon fiyatı gönderilecek
                            $season->unitPrices->each(function ($unitPrice) use ($differencePeriod, $activedHRChannels) {
                                if (in_array($unitPrice->booking_channel_id, $activedHRChannels->toArray())) {
                                    $roomChannelsBasePrice = $unitPrice->typeHasView->unitPrices->filter(function ($value) {
                                        return $value->season_id === null && $value->booking_channel_id === null;
                                    })->first();
                                    //Tburda birden fazla kanala baz fiyatlar gönderilecek.. Kanalları çekebilmek için yaptık
                                    //$differencePeriod varolan sezon fiyatını gönder.
                                    UnitPriceJob::dispatch($unitPrice, $differencePeriod['start_date'], $differencePeriod['end_date'], $roomChannelsBasePrice->unit_price)->onQueue('price');
                                }
                            });
                        }
                    }
                }
            }
        }
    }

    public function saved(Season $season): void
    {
    }

    public function deleted(Season $season): void
    {
    }

    public function restored(Season $season): void
    {
    }

    public function forceDeleted(Season $season): void
    {
    }
}
