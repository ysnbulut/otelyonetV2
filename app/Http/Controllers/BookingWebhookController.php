<?php

namespace App\Http\Controllers;

use App\Helpers\ChannelManagers;
use App\Helpers\Currencies;
use App\Http\Requests\WebHookRequest;
use App\Mail\Hotel\ReservationMail;
use App\Models\{
    Booking, BookingChannel, BookingDailyPrice, BookingRoom, CMBooking, CMRoom, Customer, Hotel, Room, Tax, Tenant, TypeHasView
};
use App\Settings\{HotelSettings, PricingPolicySettings};
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\{Log, Mail};
use JsonException;
use Random\RandomException;
use Seld\JsonLint\ParsingException;
use Teknomavi\Tcmb\Exception\UnknownPriceType;

class BookingWebhookController extends Controller
{
    protected PricingPolicySettings $setting;
    protected HotelSettings $hotelSettings;
    protected ChannelManagers $channelManager;
    protected array|Tax|Collection|Model $getSettingBookingTax;
    protected Currencies $currencies;
    protected bool $bookableRooms = true;
    protected array $unavailableRoomsIds = [];
    protected int $availableStock = 0;

    protected $hotel;
    protected string $documentCurrency;

    protected $reservationQuery;
    protected bool $reservationExists = false;
    protected float $currencyRate;

    public function __construct(
        PricingPolicySettings $setting,
        HotelSettings $hotelSettings,
        Currencies $currencies
    ) {
        $this->setting = $setting;
        $this->hotelSettings = $hotelSettings;
        $this->currencies = $currencies;
    }

    /**
     * @throws JsonException
     * @throws RandomException
     * @throws ParsingException
     * @throws UnknownPriceType
     */
    public function handleWebhook(Tenant $tenant, WebHookRequest $request)
    {
        $webhookData = json_decode($request->data, true, 512, JSON_THROW_ON_ERROR);

        return $tenant->run(function () use ($webhookData) {

            $this->initializeChannelManager();

            $this->getSettingBookingTax = Tax::find($this->setting->tax_rate['value']);

            $this->getUnavailableRoomsIds($webhookData);

            $currencyData = $this->convertCurrency($webhookData['currency']);
            $this->currencyRate = $currencyData['currencyRate'];
            $this->documentCurrency = $currencyData['documentCurrency'];

            $this->processCMRooms($webhookData);

            if ($this->bookableRooms) {
                $customerData = $this->prepareCustomerData($webhookData);

                $channel = BookingChannel::firstOrCreate(
                    ['code' => $webhookData['channel']],
                    ['name' => $webhookData['channel_display'], 'active' => 1]
                );

                $this->reservationQuery = CMBooking::where('cm_booking_code', $webhookData['hr_number']);
                $this->reservationExists = $this->reservationQuery->exists();
                $this->hotel = Hotel::whereTenantId(tenancy()->tenant->id)->first();
                switch ($webhookData['reason']) {
                    case 'cancel':
                        return $this->handleCancel($webhookData);
                    case 'modify':
                        return $this->handleModify($webhookData, $channel, $customerData);
                    case 'confirm':
                        return $this->handleConfirm($webhookData, $channel, $customerData);
                }
            }

            return ['status' => 'error'];
        });
    }

    private function initializeChannelManager(): void
    {
        $this->channelManager = new ChannelManagers(
            $this->hotelSettings->channel_manager['value'],
            [
                'token' => $this->hotelSettings->api_settings['token'],
                'hr_id' => $this->hotelSettings->api_settings['hr_id']
            ]
        );
    }

    private function getUnavailableRoomsIds(array $webhookData): void
    {
        $this->unavailableRoomsIds = Booking::getUnavailableRoomsIds(
            $webhookData['rooms'][0]['checkin_date'],
            $webhookData['rooms'][0]['checkout_date']
        );
    }

    protected function convertCurrency($currency): array
    {
        $documentCurrency = $currency;
        $currencyRate = 1;

        if ($this->setting->currency['value'] !== $currency) {
            $currencyConvert = $this->currencies->convert($currency, $this->setting->currency['value'], 1);
            if ($currencyConvert['status']) {
                $documentCurrency = $currencyConvert['to_currency'];
                $currencyRate = $currencyConvert['exchange_rate'];
            }
        }

        return [
            'documentCurrency' => $documentCurrency,
            'currencyRate' => $currencyRate
        ];
    }

    private function processCMRooms(array $webhookData): void
    {
        CMRoom::whereIn('room_code', collect($webhookData['rooms'])->pluck('inv_code')->map(fn($code) => last(explode(':', $code)))->unique()->toArray())
            ->get()
            ->each(function ($cm_room) {
                $this->availableStock = count(array_diff($cm_room->typeHasView->rooms->pluck('id')->toArray(), array_intersect($this->unavailableRoomsIds, $cm_room->typeHasView->rooms->pluck('id')->toArray())));

                if ($this->availableStock < max($cm_room->typeHasView->rooms->count() - $cm_room->stock, 0) || $this->availableStock === 0) {
                    $this->bookableRooms = false;
                }
            });
    }

    private function prepareCustomerData(array $webhookData): array
    {
        return collect([
            'title' => $webhookData['billing_address']['company'] ?: $webhookData['guest'],
            'type' => $webhookData['billing_address']['company'] === '' ? 'individual' : 'company',
            'tax_office' => $webhookData['billing_address']['tax_office'],
            'tax_number' => $webhookData['billing_address']['tax_id'] ?: '1111111111',
            'country' => $webhookData['billing_address']['country'],
            'city' => $webhookData['billing_address']['city'],
            'address' => sprintf('%s %s %s %s', $webhookData['billing_address']['street'], $webhookData['billing_address']['street_2'], $webhookData['billing_address']['state'], $webhookData['billing_address']['country']),
            'phone' => $webhookData['address']['phone'] ?: $webhookData['billing_address']['phone'],
            'email' => $webhookData['address']['email'] ?: $webhookData['billing_address']['email'],
        ])->toArray();
    }

    private function handleCancel(array $webhookData): array
    {

        if (($this->reservationExists) && $this->reservationQuery?->first()) {

            BookingRoom::withoutEvents(function () use ($webhookData) {
                $this->reservationQuery->first()->booking->rooms->each(function ($room) {
                    $room->documents->each->delete();
                    $room->tasks->each->delete();
                    $room->booking_guests->each->delete();
                    $room->prices->each->delete();
                    $room->delete();
                });

                @$this->reservationQuery->first()->booking->cMBooking->delete();
                @$this->reservationQuery->first()->booking->notes->each->delete();
                @$this->reservationQuery->first()->booking->tasks->each->delete();
                @$this->reservationQuery->first()->booking->cancelReason->delete();

                $this->confirmReservation($webhookData, $this->reservationQuery->first()->booking);

                @$this->reservationQuery->first()->booking->delete();

            });

        }

        return ['status' => 'ok'];
    }

    private function handleModify(array $webhookData, BookingChannel $channel, array $customerData): array
    {
        if (($this->reservationExists) && $this->reservationQuery?->first()) {
            $this->reservationQuery->first()->booking->updateIfDirty([
                'channel_id' => $channel->id,
                'number_of_rooms' => $webhookData['total_rooms'],
                'number_of_adults' => $webhookData['total_guests'],
                'number_of_children' => collect($webhookData['rooms'])->sum(fn($room) => count($room['child_ages'])),
            ]);

            $this->reservationQuery->first()->booking->customer->updateIfDirty($customerData);

            foreach ($webhookData['rooms'] as $room) {
                $this->processRoom($this->reservationQuery->first()->booking, $room);
            }

            $this->confirmReservation($webhookData, $this->reservationQuery->first()->booking);

        }

        return ['status' => 'ok'];
    }

    private function processRoom(Booking $booking, array $room): void
    {
        $CMRoom = CMRoom::where('room_code', last(explode(':', $room['inv_code'])))->first();

        if ($CMRoom) {
            $typeHasViewsRooms = TypeHasView::find($CMRoom->type_has_view_id)->rooms->pluck('id');
            $bookingRoom = BookingRoom::where('booking_id', $booking->id)->whereIn('room_id', $typeHasViewsRooms)->first();
            $price = $room['price'] * $this->currencyRate;

            if ($bookingRoom) {
                $this->updateBookingRoom($bookingRoom, $price, $room);
            } else {
                $this->createBookingRoom($booking, $CMRoom, $room, $price);
            }
        }
    }

    private function updateBookingRoom(BookingRoom $bookingRoom, float $price, array $room): void
    {
        $this->updateBookingRoomPrices($bookingRoom, $price, $room);
    }

    private function createBookingRoom(Booking $booking, CMRoom $CMRoom, array $room, float $price): void
    {
        $bookingRoom = BookingRoom::create([
            'booking_id' => $booking->id,
            'room_id' => $CMRoom->id,
            'number_of_adults' => $room['adult'],
            'number_of_children' => count($room['child_ages']),
            'child_ages' => $room['child_ages'],
        ]);

        $this->createBookingRoomPrices($bookingRoom, $price, $room);
    }

    private function updateBookingRoomPrices(BookingRoom $bookingRoom, float $price, array $room): void
    {
        BookingDailyPrice::where('booking_room_id', $bookingRoom->id)->delete();

        foreach (range(0, Carbon::parse($room['checkout_date'])->diffInDays(Carbon::parse($room['checkin_date']))) as $day) {
            BookingDailyPrice::create([
                'booking_room_id' => $bookingRoom->id,
                'date' => Carbon::parse($room['checkin_date'])->addDays($day)->toDateString(),
                'price' => $price / Carbon::parse($room['checkout_date'])->diffInDays(Carbon::parse($room['checkin_date']))
            ]);
        }
    }

    private function createBookingRoomPrices(BookingRoom $bookingRoom, float $price, array $room): void
    {
        foreach (range(0, Carbon::parse($room['checkout_date'])->diffInDays(Carbon::parse($room['checkin_date']))) as $day) {
            BookingDailyPrice::create([
                'booking_room_id' => $bookingRoom->id,
                'date' => Carbon::parse($room['checkin_date'])->addDays($day)->toDateString(),
                'price' => $price / Carbon::parse($room['checkout_date'])->diffInDays(Carbon::parse($room['checkin_date']))
            ]);
        }
    }

    private function handleConfirm(array $webhookData, BookingChannel $channel, array $customerData): array
    {
        $customer = Customer::updateOrCreate(['email' => $customerData['email']], $customerData);

        $bookingData = $this->prepareBookingData($webhookData, $channel, $customer);


        if($this->reservationExists) {
            return ['status' => 'ok'];
        }

        $booking = Booking::create($bookingData);

        $booking->cMBooking()->create([
            'booking_id' => $booking->id,
            'cm_booking_code' => $webhookData['hr_number'],
            'cm_channel_code' => $webhookData['channel']
        ]);

        $this->processBookingRooms($booking, $webhookData['rooms']);

        //Mail::to($customer->email)->send(new ReservationMail($booking));

        $this->confirmReservation($webhookData, $booking);

        return ['status' => 'ok'];
    }

    private function prepareBookingData(array $webhookData, BookingChannel $channel, Customer $customer): array
    {
        return [
            'channel_id' => $channel->id,
            'number_of_rooms' => $webhookData['total_rooms'],
            'number_of_adults' => $webhookData['total_guests'],
            'number_of_children' => collect($webhookData['rooms'])->sum(fn($room) => count($room['child_ages'])),
            'status' => 'received',
            'customer_id' => $customer->id,
            'price' => collect($webhookData['rooms'])->sum(fn($room) => $room['price'] * $this->currencyRate),
            'calendar_colors' => $this->getRandomColors(),
        ];
    }

    private function processBookingRooms(Booking $booking, array $rooms): void
    {
        foreach ($rooms as $room) {

            $CMRoom = CMRoom::where('room_code', last(explode(':',  $room['inv_code'])))->first();

            $randomRoom = TypeHasView::where('id', $CMRoom->type_has_view_id)->with(['rooms' => function ($query) {
                $query->whereNotIn('id', $this->unavailableRoomsIds);
            }])->whereHas('rooms')->first()->rooms->first();

            if ($CMRoom) {
                $bookingRoom = BookingRoom::withoutEvents(static function () use ($booking, $randomRoom, $room) {
                    return BookingRoom::create([
                        'booking_id' => $booking->id,
                        'room_id' => $randomRoom->id,
                        'number_of_adults' => $room['total_adult'],
                        'number_of_children' => count($room['child_ages']),
                        //'total_price' => $room['price'] * $this->currencyRate,
                        //'status' => $room['status']
                    ]);
                });

                // Booking Note

                $document = $bookingRoom->documents()->create([
                    'type' => 'invoice',
                    'customer_id' => $bookingRoom->booking->customer_id,
                    'status' => 'received',
                    'currency' => $this->documentCurrency,
                    'currency_rate' => $this->currencyRate,
                    'issue_date' => $room['checkin_date'],
                    'due_date' => $room['checkout_date'],
                ]);

                $document->items()->create([
                    'item_id' => null,
                    'name' => $this->getItemName(
                        $randomRoom,
                        $room['checkin_date'],
                        $room['checkout_date'],
                        $room['nights'],
                        $room['total_adult'],
                        $room['child_ages'],
                        round($room['price'] * $this->currencyRate, 2) . ' ' . $this->documentCurrency
                    ),
                    'description' => '',
                    'price' => $room['price'] * (1 - $this->getSettingBookingTax->rate / 100),
                    'quantity' => 1,
                    'tax_name' => $this->getSettingBookingTax->name,
                    'tax_rate' => $this->getSettingBookingTax->rate,
                    'tax' => $this->getSettingBookingTax->rate * $room['price'] / 100,
                    'total' => $room['price'] * $this->currencyRate,
                    'discount' => 0,
                    'grand_total' => $room['price'] * $this->currencyRate,
                ]);

                $document->total()->create([
                    'type' => 'subtotal',
                    'sort_order' => 1,
                    'amount' => $room['price'] * (1 - $this->getSettingBookingTax->rate / 100),
                ]);

                $document->total()->create([
                    'type' => 'tax',
                    'sort_order' => 2,
                    'amount' => $this->getSettingBookingTax->rate * $room['price'] / 100,
                ]);

                $document->total()->create([
                    'type' => 'total',
                    'sort_order' => 3,
                    'amount' => $room['price'] * $this->currencyRate,
                ]);

                $this->sendNotification($booking ,  $room['price'] * $this->currencyRate);

                $this->createBookingRoomPrices($bookingRoom, $room['price'] * $this->currencyRate, $room);
            }
        }
    }

    protected function getRandomColors($maxBrightness = 200, $maxAttempts = 10, $attempts = 0): array
    {
        $backgroundColor = "#" . str_pad(dechex(random_int(0, 0xFFFFFF)), 6, '0', STR_PAD_LEFT);

        [$r, $g, $b] = sscanf($backgroundColor, "#%02x%02x%02x");

        do {
            $brightness = ($r * 299 + $g * 587 + $b * 114) / 1000;
            $attempts++;
        } while ($brightness > $maxBrightness && $attempts < $maxAttempts);

        return array(
            "backgroundColor" => $backgroundColor,
            "textColor" => ($brightness > 128) ? "#000000" : "#FFFFFF",
            "borderColor" => sprintf("#%02x%02x%02x", max(0, $r - 20), max(0, $g - 20), max(0, $b - 20))
        );
    }

    public function getItemName($room ,$checkin_date, $checkout_date, $nights, $total_adult, $child_ages, $price): string
    {

        return sprintf(
            '%s %s (%s - %s) %s Gece %s Yetişkin %s %s Konaklama Bedeli.',
            $room->roomType->name,
            $room->roomView->name,
            Carbon::parse($checkin_date)->format('d.m.Y'),
            Carbon::parse($checkout_date)->format('d.m.Y'),
            $nights,
            $total_adult,
            count($child_ages) > 0 ? ' ' . count($child_ages) . ' Çocuk' : '',
            $price
        );
    }

    public function confirmReservation($webhookData, $booking): static
    {
        if(\request()->ip() != '127.0.0.1') {
            $this->channelManager->confirmReservation($webhookData['message_uid'], $booking->booking_code);
        }

        return $this;
    }

    public function sendNotification($booking, $price): void
    {
        Mail::to($this->hotel->email)->send(new ReservationMail(
            $this->hotel->name,
            $booking->customer->title,
            $booking->customer->email,
            $booking->customer->phone,
            $this->hotel->email,
            $booking->booking_code,
            $booking->rooms->pluck('check_in')->min(),
            $booking->rooms->pluck('check_out')->max(),
            $price,
            route('hotel.bookings.show', [
                'booking' => $booking->id,
            ]),
            $booking->rooms->first()->room->roomType->name,
            $booking->channel->name
        ));
    }

}
