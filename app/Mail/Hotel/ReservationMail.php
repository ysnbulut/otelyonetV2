<?php

namespace App\Mail\Hotel;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Sichikawa\LaravelSendgridDriver\SendGrid;

class ReservationMail extends Mailable
{
    use Queueable, SerializesModels, SendGrid;

    public string $name, $phone, $email, $customerName, $customerEmail, $reservationCode, $checkIn, $checkOut, $price, $url, $roomType, $platform;

    /**
     * Create a new message instance.
     */
    public function __construct(string $name, string $customerName, string $customerEmail, string $phone, string $email, string $reservationCode, string $checkIn, string $checkOut, string $price, string $url, string $roomType, string $platform)
    {
        $this->name = $name;
        $this->customerName = $customerName;
        $this->phone = $phone;
        $this->email = $email;
        $this->reservationCode = $reservationCode;
        $this->checkIn = $checkIn;
        $this->checkOut = $checkOut;
        $this->price = $price;
        $this->url = $url;
        $this->roomType = $roomType;
        $this->platform = $platform;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $this->sendgrid([
            'personalizations' => [
                [
                    'to' => [
                        ['email' => $this->email, 'name' => $this->name],
                    ]
                ],
            ],
        ]);

        return new Envelope(
            from: env('SENDGRID_SENDER_MAIL'),
            subject: __('reservation mail subject', ['app' => env('APP_NAME')]),
        );
    }

    public function build()
    {
        return $this->view('emails.reservation')
            ->with([
                'customerName' => $this->customerName,
                'phone' => $this->phone,
                'customerEmail' => $this->email,
                'reservationCode' => $this->reservationCode,
                'checkIn' => $this->checkIn,
                'checkOut' => $this->checkOut,
                'price' => $this->price,
                'url' => $this->url,
                'roomType' => $this->roomType,
                'platform' => $this->platform,
            ]);
    }
}
