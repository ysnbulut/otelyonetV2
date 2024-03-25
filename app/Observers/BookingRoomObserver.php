<?php

namespace App\Observers;

use App\Jobs\CMStockJob;
use App\Models\BookingRoom;
use Illuminate\Support\Facades\Log;
use Spatie\Activitylog\Models\Activity;

class BookingRoomObserver
{
    public function created(BookingRoom $bookingRooms): void
    {
        Log::log('info', 'BookingRoomObserver created', ['bookingRooms' => $bookingRooms]);
        CMStockJob::dispatch($bookingRooms);
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
