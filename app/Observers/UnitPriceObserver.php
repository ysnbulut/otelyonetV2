<?php

namespace App\Observers;

use App\Jobs\ChannelManager\UnitPriceJob;
use App\Models\BookingChannel;
use App\Models\UnitPrice;
use App\Settings\HotelSettings;
use Spatie\Activitylog\Models\Activity;

class UnitPriceObserver
{
    public function created(UnitPrice $unitPrice): void
    {
        $hotelSettings = new HotelSettings();
        $cmIsEnabled = $hotelSettings->channel_manager['value'] !== 'closed';
        if ($cmIsEnabled) {
            $activedHRChannels = BookingChannel::where('active', true)->whereNotIn('code', ['web', 'reception', 'agency', 'online'])->pluck('id');
            if ($unitPrice->season_id !== null || ($unitPrice->booking_channel_id !== null && in_array($unitPrice->booking_channel_id, $activedHRChannels->toArray()))) {
                UnitPriceJob::dispatch($unitPrice, $unitPrice->season->start_date, $unitPrice->season->end_date, $unitPrice->unit_price)->onQueue('price');
                \Log::info('Unit Price created');
                Activity::create([
                    'log_name' => 'unit_price',
                    'description' => 'updated',
                    'subject_id' => $unitPrice->id,
                    'subject_type' => UnitPrice::class,
                    'event' => 'updated',
                    'causer_id' => auth()->id(),
                    'causer_type' => get_class(auth()->user()),
                    'properties' => [
                        'attributes' => $unitPrice->getAttributes(),
                        'channel_manager' => true,
                    ],
                ]);
            } else {
                Activity::create([
                    'log_name' => 'unit_price',
                    'description' => 'updated',
                    'subject_id' => $unitPrice->id,
                    'subject_type' => UnitPrice::class,
                    'event' => 'updated',
                    'causer_id' => auth()->id(),
                    'causer_type' => get_class(auth()->user()),
                    'properties' => [
                        'attributes' => $unitPrice->getAttributes(),
                        'channel_manager' => false,
                    ],
                ]);
            }
        } else {
            Activity::create([
                'log_name' => 'unit_price',
                'description' => 'updated',
                'subject_id' => $unitPrice->id,
                'subject_type' => UnitPrice::class,
                'event' => 'updated',
                'causer_id' => auth()->id(),
                'causer_type' => get_class(auth()->user()),
                'properties' => [
                    'attributes' => $unitPrice->getAttributes(),
                    'channel_manager' => false,
                ],
            ]);
        }
    }

    public function updated(UnitPrice $unitPrice): void
    {
        $hotelSettings = new HotelSettings();
        $cmIsEnabled = $hotelSettings->channel_manager['value'] !== 'closed';
        if ($cmIsEnabled) {
            $activedHRChannels = BookingChannel::where('active', true)->whereNotIn('code', ['web', 'reception', 'agency', 'online'])->pluck('id');
            if ($unitPrice->season_id !== null || ($unitPrice->booking_channel_id !== null && in_array($unitPrice->booking_channel_id, $activedHRChannels->toArray()))) {
                UnitPriceJob::dispatch($unitPrice, $unitPrice->season->start_date, $unitPrice->season->end_date, $unitPrice->unit_price)->onQueue('price');
                Activity::create([
                    'log_name' => 'unit_price',
                    'description' => 'updated',
                    'subject_id' => $unitPrice->id,
                    'subject_type' => UnitPrice::class,
                    'event' => 'updated',
                    'causer_id' => auth()->id(),
                    'causer_type' => get_class(auth()->user()),
                    'properties' => [
                        'attributes' => [
                            'old' => $unitPrice->getOriginal(),
                            'new' => $unitPrice->getAttributes(),
                        ],
                        'channel_manager' => true,
                    ],
                ]);
            } else {
                Activity::create([
                    'log_name' => 'unit_price',
                    'description' => 'updated',
                    'subject_id' => $unitPrice->id,
                    'subject_type' => UnitPrice::class,
                    'event' => 'updated',
                    'causer_id' => auth()->id(),
                    'causer_type' => get_class(auth()->user()),
                    'properties' => [
                        'attributes' => [
                            'old' => $unitPrice->getOriginal(),
                            'new' => $unitPrice->getAttributes(),
                        ],
                        'channel_manager' => false,
                    ],
                ]);
            }
        } else {
            Activity::create([
                'log_name' => 'unit_price',
                'description' => 'updated',
                'subject_id' => $unitPrice->id,
                'subject_type' => UnitPrice::class,
                'event' => 'updated',
                'causer_id' => auth()->id(),
                'causer_type' => get_class(auth()->user()),
                'properties' => [
                    'attributes' => [
                        'old' => $unitPrice->getOriginal(),
                        'new' => $unitPrice->getAttributes(),
                    ],
                    'channel_manager' => false,
                ],
            ]);
        }
    }
}
