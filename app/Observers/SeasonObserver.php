<?php

namespace App\Observers;

use App\Jobs\ChannelManager\UnitPriceJob;
use App\Models\BookingChannel;
use App\Models\CMRoom;
use App\Models\Season;
use App\Models\TypeHasView;
use Carbon\CarbonPeriod;
use Illuminate\Support\Facades\Log;

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
        $newPeriod = CarbonPeriod::create($changes['start_date'], $changes['end_date']);
        $oldDates = $oldPeriod->toArray();
        $newDates = $newPeriod->toArray();
        $intersection = array_intersect($oldDates, $newDates);
        $difference = array_diff($oldDates, $newDates);
        //Kullanmadık...
//        $intersectionPeriod = [
//            'start' => min($intersection),
//            'end' => max($intersection),
//        ];
        $differencePeriod = [
            'start_date' => min($difference),
            'end_date' => max($difference),
        ];
        $activedHRChannels = BookingChannel::where('active', true)->whereNotIn('code', ['web', 'reception', 'agency', 'online'])->pluck('id');
        if (count($oldDates) === count($newDates)) {
            if (!empty($difference)) {
                $newPeriodInterDiff = array_diff($newPeriod, $intersection);
                $addSeasonForNewPeriod = [
                    'start_date' => min($newPeriodInterDiff),
                    'end_date' => max($newPeriodInterDiff),
                ];
                $newPeriodDiffDiff = array_diff($newPeriod, $difference);
                $addSeasonForDiffPeriod = [
                    'start_date' => min($newPeriodDiffDiff),
                    'end_date' => max($newPeriodDiffDiff),
                ];
                //$addSeasonForDiffPeriod için baz fiyat $addSeasonForNewPeriod için varolan fiyat gönderilecek
                CMRoom::all()->each(function ($room) use ($addSeasonForDiffPeriod, $season, $activedHRChannels, $addSeasonForNewPeriod) {
                    $roomChannelsBasePrice = $room->unitPrices()->whereNull('season_id')->whereNull('booking_channel_id')->first();
                    $season
                        ->unitPrices()
                        ->where('type_has_view_id', $room->typeHasView->id)
                        ->whereIn('booking_channel_id', $activedHRChannels)->each(function ($unitPrice) use ($addSeasonForDiffPeriod, $addSeasonForNewPeriod, $roomChannelsBasePrice) {
                            //burda birden fazla kanala varolan fiyatlar gönderilecek.. Kanalları çekebilmek için yaptık
                            //$addSeasonForNewPeriod varolan sezon fiyatını gönder.
                            UnitPriceJob::dispatch($unitPrice, $addSeasonForNewPeriod['start_date'], $addSeasonForNewPeriod['end_date'], $unitPrice->unit_price)->onQueue('price');
                            if ($roomChannelsBasePrice !== null) {
                                //$addSeasonForDiffPeriod için $roomChannelsBasePrice baz sezon fiyatı gönderilecek
                                UnitPriceJob::dispatch($unitPrice, $addSeasonForDiffPeriod['start_date'], $addSeasonForDiffPeriod['end_date'], $roomChannelsBasePrice->unit_price)
                                    ->onQueue('price');
                            }
                        });
                });
            }
        } elseif (min($newDates) === min($oldDates) && max($newDates) >= max($oldDates)) {
            if (!empty($difference)) {
                //UZATTIK SEZONU UZATTIK
                //$differencePeriod var olan sezon fiyatı gönderilecek
                CMRoom::all()->each(function ($room) use ($differencePeriod, $season, $activedHRChannels) {
                    $season
                        ->unitPrices()
                        ->where('type_has_view_id', $room->typeHasView->id)
                        ->whereIn('booking_channel_id', $activedHRChannels)->each(function ($unitPrice) use ($differencePeriod) {
                            //burda birden fazla kanala varolan fiyatlar gönderilecek.. Kanalları çekebilmek için yaptık
                            //$differencePeriod varolan sezon fiyatını gönder.
                            UnitPriceJob::dispatch($unitPrice, $differencePeriod['start_date'], $differencePeriod['end_date'], $unitPrice->unit_price)->onQueue('price');
                        });
                });
            }
        } elseif (min($newDates) === min($oldDates) && max($newDates) <= max($oldDates)) {
            if (!empty($difference)) {
                //Kısalttık SEZONU Kısalttık
                //$differencePeriod var olan sezon fiyatı gönderilecek
                CMRoom::all()->each(function ($room) use ($differencePeriod, $season, $activedHRChannels) {
                    $roomChannelsBasePrice = $room->unitPrices()->whereNull('season_id')->whereNull('booking_channel_id')->first();
                    $season
                        ->unitPrices()
                        ->where('type_has_view_id', $room->typeHasView->id)
                        ->whereIn('booking_channel_id', $activedHRChannels)->each(function ($unitPrice) use ($differencePeriod, $roomChannelsBasePrice) {
                            //Tburda birden fazla kanala baz fiyatlar gönderilecek.. Kanalları çekebilmek için yaptık
                            //$differencePeriod varolan sezon fiyatını gönder.
                            UnitPriceJob::dispatch($unitPrice, $differencePeriod['start_date'], $differencePeriod['end_date'], $roomChannelsBasePrice->unit_price)->onQueue('price');
                        });
                });
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
