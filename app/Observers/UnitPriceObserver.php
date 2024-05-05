<?php

namespace App\Observers;

use App\Jobs\ChannelManager\CMUnitPriceJob;
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
            CMUnitPriceJob::dispatch($unitPrice)->onQueue('price');
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
    }

    public function updated(UnitPrice $unitPrice): void
    {
        $hotelSettings = new HotelSettings();
        $cmIsEnabled = $hotelSettings->channel_manager['value'] !== 'closed';
        if ($cmIsEnabled) {
            CMUnitPriceJob::dispatch($unitPrice);
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
    }
}
