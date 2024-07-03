<?php

namespace App\Observers;

use App\Models\Booking;

class BookingObserver
{
    public function created(Booking $booking): void
    {
    }

    public function deleted(Booking $booking): void
    {
    }

    public function forceDeleted(Booking $booking): void
    {
    }
}
