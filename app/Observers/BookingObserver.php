<?php

namespace App\Observers;

use Aloha\Twilio\TwilioInterface;
use App\Mail\Hotel\ReservationMail;
use App\Models\Booking;
use App\Models\Hotel;
use Illuminate\Support\Facades\Mail;
use Random\RandomException;
use Sqids\Sqids;

class BookingObserver
{

    protected TwilioInterface $twilio;

    public function __construct(TwilioInterface $twilio)
    {
        $this->twilio = $twilio;
    }

    /**
     * @throws RandomException
     */
    public function created(Booking $booking): void
    {
        $sqids = new Sqids('ABCDEFGHJKLMNPQRSTUVWXYZ', 9);
        $randomNumber = random_int(1000, 9999);
        $datePart = date('Ym');
        $count = $booking::whereYear('created_at', date('Y'))
                ->whereMonth('created_at', date('m'))
                ->count() + 1;
        $count = str_pad($count, 4, '0', STR_PAD_LEFT);

        $booking_code = $sqids->encode([$datePart . $count . $randomNumber]);

        $booking->booking_code = $booking_code;
        $booking->save();

//        if ($booking->channel_id < 122) {
//            $this->twilio->message(tenant()->hotel->phone, sprintf('Sistemde rezervasyon gelmistir. Rezervasyon kodu: %s', $booking_code));
//        }
    }

    public function deleted(Booking $booking): void
    {
    }

    public function forceDeleted(Booking $booking): void
    {
    }
}
