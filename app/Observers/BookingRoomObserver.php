<?php

namespace App\Observers;

use App\Jobs\ChannelManager\StockJob;
use App\Models\BookingRoom;
use App\Settings\HotelSettings;
use App\Settings\PricingPolicySettings;
use Spatie\Activitylog\Models\Activity;

class BookingRoomObserver
{
    protected bool $cmIsEnabled;

    public function __construct()
    {
        $hotelSettings = new HotelSettings();
        $this->cmIsEnabled = $hotelSettings->channel_manager['value'] !== 'closed';
    }

    public function created(BookingRoom $bookingRooms): void
    {
        if ($this->cmIsEnabled) {
            StockJob::dispatch($bookingRooms)->onQueue('stock');
            $activityLogDescription = 'created_cm_enabled';
        } else {
            $activityLogDescription = 'created_cm_disabled';
        }
        Activity::create([
            'log_name' => 'booking_room',
            'description' => $activityLogDescription,
            'event' => 'created',
            'subject_id' => $bookingRooms->id,
            'subject_type' => BookingRoom::class,
            'causer_id' => auth()->id(),
            'causer_type' => get_class(auth()->user()),
            'properties' => $bookingRooms->toArray(),
        ]);
    }

    public function updated(BookingRoom $bookingRooms): void
    {

        if ($this->cmIsEnabled) {
            StockJob::dispatch($bookingRooms)->onQueue('stock');
            $activityLogDescription = 'updated_cm_enabled';
        } else {
            $activityLogDescription = 'updated_cm_disabled';
        }
        Activity::create([
            'log_name' => 'booking_room',
            'description' => $activityLogDescription,
            'event' => 'updated',
            'subject_id' => $bookingRooms->id,
            'subject_type' => BookingRoom::class,
            'causer_id' => auth()->id(),
            'causer_type' => get_class(auth()->user()),
            'properties' => $bookingRooms->toArray(),
        ]);
    }

    public function deleted(BookingRoom $bookingRooms): void
    {
        if ($this->cmIsEnabled) {
            StockJob::dispatch($bookingRooms)->onQueue('stock');
            $activityLogDescription = 'deleted_cm_enabled';
        } else {
            $activityLogDescription = 'deleted_cm_disabled';
        }
        Activity::create([
            'log_name' => 'booking_room',
            'description' => $activityLogDescription,
            'event' => 'deleted',
            'subject_id' => $bookingRooms->id,
            'subject_type' => BookingRoom::class,
            'causer_id' => auth()->id(),
            'causer_type' => get_class(auth()->user()),
            'properties' => $bookingRooms->toArray(),
        ]);
    }

    public function forceDeleted(BookingRoom $bookingRooms): void
    {
        if ($this->cmIsEnabled) {
            StockJob::dispatch($bookingRooms)->onQueue('stock');
            $activityLogDescription = 'forceDeleted_cm_enabled';
        } else {
            $activityLogDescription = 'forceDeleted_cm_disabled';
        }

        Activity::create([
            'log_name' => 'booking_room',
            'description' => $activityLogDescription,
            'event' => 'forceDeleted',
            'subject_id' => $bookingRooms->id,
            'subject_type' => BookingRoom::class,
            'causer_id' => auth()->id(),
            'causer_type' => get_class(auth()->user()),
            'properties' => $bookingRooms->toArray(),
        ]);
    }
}
