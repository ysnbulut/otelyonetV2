<?php

namespace App\Observers;

use App\Jobs\ChannelManager\CMStockJob;
use App\Models\BookingRoom;
use Spatie\Activitylog\Models\Activity;

class BookingRoomObserver
{
    public function created(BookingRoom $bookingRooms): void
    {
        CMStockJob::dispatch($bookingRooms)->onQueue('stock');
        Activity::create([
            'log_name' => 'booking_room',
            'description' => 'created',
            'subject_id' => $bookingRooms->id,
            'subject_type' => BookingRoom::class,
            'causer_id' => auth()->id(),
            'causer_type' => get_class(auth()->user()),
        ]);
    }

    public function updated(BookingRoom $bookingRooms): void
    {
    }

    public function deleted(BookingRoom $bookingRooms): void
    {
    }

    public function forceDeleted(BookingRoom $bookingRooms): void
    {
    }
}
