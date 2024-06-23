<?php

namespace App\Http\Controllers;

use App\Helpers\ChannelManagers;
use App\Http\Requests\WebHookRequest;
use App\Models\Booking;
use App\Models\BookingChannel;
use App\Models\BookingDailyPrice;
use App\Models\BookingRoom;
use App\Models\CMBooking;
use App\Models\CMRoom;
use App\Models\Customer;
use App\Models\Room;
use App\Models\Tax;
use App\Models\Tenant;
use App\Models\TypeHasView;
use App\Settings\HotelSettings;
use App\Settings\PricingPolicySettings;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use JsonException;
use LaravelIdea\Helper\App\Models\_IH_Tax_C;
use Random\RandomException;

class BookingWebhookController extends Controller
{

    protected PricingPolicySettings $setting;
    protected HotelSettings $hotelSettings;
    protected ChannelManagers $channelManager;
    protected _IH_Tax_C|array|null|Tax|Collection|Model $getSettingBookingTax;

    /**
     * @throws JsonException
     * @throws RandomException
     */
    public function handleWebhook(Tenant $tenant, WebHookRequest $request)
    {
        $webhookData = json_decode($request->data, true, 512, JSON_THROW_ON_ERROR);
        return $tenant->run(function () use ($webhookData) {
            $this->setting = new PricingPolicySettings();
            $this->hotelSettings = new HotelSettings();
            $this->channelManager = new ChannelManagers($this->hotelSettings->channel_manager['value'], ['token' =>
                $this->hotelSettings->api_settings['token'],
                'hr_id' => $this->hotelSettings->api_settings['hr_id']]);
            $this->getSettingBookingTax = Tax::find($this->setting->tax_rate['value']);
            $webhookDataRoomsCollect = collect($webhookData['rooms']);
            $unavailableRoomsIds = Booking::getUnavailableRoomsIds($webhookData['checkin_date'], $webhookData['checkout_date']);
            $bookableRooms = true;
            CMRoom::whereIn('room_code', $webhookDataRoomsCollect->pluck('code')->unique()->map
            (function ($code) {
                return str_replace('HR:', '', $code);
            })->toArray())->get()->each(function ($cm_room) use ($unavailableRoomsIds, &$bookableRooms) {
                $typeHasViewsRooms = $cm_room->typeHasView->rooms->pluck('id');
                $unavailableRIDSDiff = array_intersect($unavailableRoomsIds, $typeHasViewsRooms->toArray());
                $availableStock = collect(array_diff($typeHasViewsRooms->toArray(), $unavailableRIDSDiff))->flatten()->count();
                $CMStockDiff = max($typeHasViewsRooms->count() - $cm_room->stock, 0);
                if ($availableStock < $CMStockDiff || $availableStock === 0) {
                    $bookableRooms = false;
                    return true;
                }
                return false;
            });
            if ($bookableRooms) {
                $customerData = [
                    'title' => $webhookData['billing_address']['company'] === '' ? $webhookData['guest'] : $webhookData['billing_address']['company'],
                    'type' => $webhookData['billing_address']['company'] === '' ? 'individual' : 'company',
                    'tax_office' => $webhookData['billing_address']['tax_office'],
                    'tax_number' => $webhookData['billing_address']['tax_id'] === '' ? '1111111111' : $webhookData['billing_address']['tax_id'],
                    'country' => $webhookData['billing_address']['country'],
                    'city' => $webhookData['billing_address']['city'],
                    'address' => $webhookData['billing_address']['street'] . ' ' . $webhookData['billing_address']['street_2']
                        . ' ' . $webhookData['billing_address']['state'] . ' ' . $webhookData['billing_address']['country'],
                    'phone' => $webhookData['billing_address']['phone'] === '' ? $webhookData['address']['phone'] : $webhookData['billing_address']['phone'],
                    'email' => $webhookData['billing_address']['email'] === '' ? $webhookData['address']['email'] : $webhookData['billing_address']['email'],
                ];
                $channel = BookingChannel::where('code', $webhookData['channel'])->first();
                if ($channel === null) {
                    $channel_id = 120;
                } else {
                    $channel_id = $channel->id;
                }
                $unavailableRoomsIds = Booking::getUnavailableRoomsIds($webhookData['checkin_date'], $webhookData['checkout_date']);

                if ($webhookData['reason'] === 'cancel') {
                    $cMBooking = CMBooking::where('cm_booking_code', $webhookData['hr_number'])->first();
                    $booking = $cMBooking !== NULL ? Booking::find($cMBooking->booking_id) : NULL;
                    if ($booking !== NULL) {
                        BookingRoom::withoutEvents(function () use ($booking, $webhookData) {
                            $booking->rooms->each(function ($room) {
                                $room->documents->each(function ($document) {
                                    $document->items->each(function ($item) {
                                        $item->delete();
                                    });
                                    $document->total->each(function ($total) {
                                        $total->delete();
                                    });
                                    $document->payments->each(function ($payment) {
                                        $payment->delete();
                                    });
                                    $document->delete();
                                });
                                $room->tasks->each(function ($task) {
                                    $task->delete();
                                });
                                $room->booking_guests->each(function ($guest) {
                                    $guest->delete();
                                });
                                $room->prices->each(function ($price) {
                                    $price->delete();
                                });
                                $room->cancelReason->delete();
                                $room->delete();
                            });
                            $booking->cMBooking->delete();
                            $booking->notes->each(function ($note) {
                                $note->delete();
                            });
                            $booking->tasks->each(function ($task) {
                                $task->delete();
                            });
                            $booking->cancelReason->delete();
                            $booking->delete();
                            $this->channelManager->confirmReservation($webhookData['message_uid'], $booking->booking_code);
                        });
                    }
                    return [
//                        'message' => 'Booking ' . $webhookData['reason'] . ' successfully',
                        'status' => 'ok',
//                        'data' => $webhookData,
                    ];
                }
                if ($webhookData['reason'] === 'modify') {
                    $cMBooking = CMBooking::where('cm_booking_code', $webhookData['hr_number'])->first();
                    $booking = Booking::find($cMBooking->booking_id);
                    if ($booking !== null) {
                        $booking->fill([
                            'channel_id' => $channel_id,
                            'number_of_rooms' => $webhookData['total_rooms'],
                            'number_of_adults' => $webhookData['total_guests'],
                            'number_of_children' => collect($webhookData['rooms'])->map(function ($room) {
                                return count($room['child_ages']);
                            })->sum(),
                        ]);
                        if ($booking->isDirty()) {
                            $booking->update($booking->getDirty());
                        }
                        $booking->customer->fill($customerData);
                        if ($booking->customer->isDirty()) {
                            $booking->customer->update($booking->customer->getDirty());
                        }
                        foreach ($webhookData['rooms'] as $room) {
                            $CMRoom = CMRoom::where('room_code', str_replace('HR:', '', $room['code']))->first();
                            if ($CMRoom !== null) {
                                $typeHasViewsRooms = TypeHasView::where('id', $CMRoom->type_has_view_id)->whereHas('rooms')->first()
                                    ->rooms->pluck('id');
                                $bookingRoom = BookingRoom::where('booking_id', $booking->id)->whereIn('room_id',
                                    $typeHasViewsRooms)->first();
                                if ($bookingRoom !== null) {
                                    $bookingRoom->fill([
                                        'check_in' => $room['checkin_date'],
                                        'check_out' => $room['checkout_date'],
                                        'number_of_adults' => $room['total_adult'],
                                        'number_of_children' => count($room['child_ages']),
                                        'children_ages' => json_encode($room['child_ages'], JSON_THROW_ON_ERROR),
                                    ]);
                                    if ($bookingRoom->isDirty()) {
                                        BookingRoom::withoutEvents(static function () use ($bookingRoom) {
                                            $bookingRoom->update($bookingRoom->getDirty());
                                        });
                                    }
                                    $bookingRoom->documents->each(function ($document) use ($room, $bookingRoom, $webhookData) {
                                        $document->fill([
                                            'currency' => $webhookData['currency'],
                                            'currency_rate' => 1, //TODO: Burada merkez bankasından döviz kuru alınabilir.
                                            'issue_date' => $room['checkin_date'],
                                            'due_date' => $room['checkout_date'],
                                        ]);
                                        if ($document->isDirty()) {
                                            $document->update($document->getDirty());
                                        }
                                        $itemName = $bookingRoom->room->roomType->name . ' ' . $bookingRoom->room->roomView->name . ' (' .
                                            Carbon::parse($room['checkin_date'])
                                                ->format
                                                ('d.m.Y') .
                                            ' - '
                                            . Carbon::parse($room['checkout_date'])->format('d.m.Y') . ') ' . $room['nights'] . ' Gece ' .
                                            $room['total_adult'] . ' Yetişkin';
                                        if (count($room['child_ages']) > 0) {
                                            $itemName .= ' ' . count($room['child_ages']) . ' Çocuk';
                                        }
                                        $itemName .= ' Konaklama Bedeli.';
                                        $subTotal = $room['price'] * (1 - $this->getSettingBookingTax->rate / 100);
                                        $tax = $this->getSettingBookingTax->rate * $room['price'] / 100;
                                        $total = $room['price'];
                                        $document->items->first()->fill([
                                            'name' => $itemName,
                                            'description' => '',
                                            'price' => $subTotal,
                                            'quantity' => 1,
                                            'tax_name' => $this->getSettingBookingTax->name,
                                            'tax_rate' => $this->getSettingBookingTax->rate,
                                            'tax' => $tax,
                                            'total' => $total,
                                            'grand_total' => $room['price'],
                                        ]);
                                        if ($document->items->first()->isDirty()) {
                                            $document->items->first()->update($document->items->first()->getDirty());
                                        }
                                        $document->total->each(function ($dtotal) use ($subTotal, $tax, $total) {
                                            if ($dtotal->type === 'subtotal') {
                                                $dtotal->fill([
                                                    'amount' => $subTotal,
                                                ]);
                                            } else if ($dtotal->type === 'tax') {
                                                $dtotal->fill([
                                                    'amount' => $tax,
                                                ]);
                                            } else if ($dtotal->type === 'total') {
                                                $dtotal->fill([
                                                    'amount' => $total,
                                                ]);
                                            }
                                            if ($dtotal->isDirty()) {
                                                $dtotal->update($dtotal->getDirty());
                                            }
                                        });
                                    });
                                } else {
                                    $deletedRoomIds = [];
                                    $booking->rooms->each(function ($bRoom) use (&$deletedRoomIds) {
                                        $deletedRoomIds[] = $bRoom->room_id;
                                        $bRoom->delete();
                                    });
                                    if (count($deletedRoomIds) > 0) {
                                        foreach ($deletedRoomIds as $del_val) {
                                            if (($key = array_search($del_val, $unavailableRoomsIds, true)) !== false) {
                                                unset($unavailableRoomsIds[$key]);
                                            }
                                        }
                                    }
                                    $randomRoom = TypeHasView::where('id', $CMRoom->type_has_view_id)->with(['rooms' => function ($query) use ($unavailableRoomsIds) {
                                        $query->whereNotIn('id', $unavailableRoomsIds);
                                    }])->whereHas('rooms')->first()->rooms->first();
                                    $bookingRoom = BookingRoom::withoutEvents(static function () use (
                                        $booking, $randomRoom,
                                        $room
                                    ) {
                                        return BookingRoom::create([
                                            'booking_id' => $booking->id,
                                            'room_id' => $randomRoom->id,
                                            'check_in' => $room['checkin_date'],
                                            'check_out' => $room['checkout_date'],
                                            'number_of_adults' => $room['total_adult'],
                                            'number_of_children' => count($room['child_ages']),
                                            'children_ages' => json_encode($room['child_ages'], JSON_THROW_ON_ERROR),
                                            'created_at' => Carbon::now(),
                                            'updated_at' => Carbon::now(),
                                        ]);
                                    });
                                    $unavailableRoomsIds[] = $randomRoom->id;
                                    $document = $bookingRoom->documents()->create([
                                        'type' => 'invoice',
                                        'customer_id' => $booking->customer->id,
                                        'status' => 'received',
                                        'currency' => $webhookData['currency'],
                                        'currency_rate' => 1, //TODO: Burada merkez bankasından döviz kuru alınabilir.
                                        'issue_date' => $room['checkin_date'],
                                        'due_date' => $room['checkout_date'],
                                    ]);
                                    $itemName = $bookingRoom->room->roomType->name . ' ' . $bookingRoom->room->roomView->name . ' (' .
                                        Carbon::parse($room['checkin_date'])
                                            ->format
                                            ('d.m.Y') .
                                        ' - '
                                        . Carbon::parse($room['checkout_date'])->format('d.m.Y') . ') ' . $room['nights'] . ' Gece ' .
                                        $room['total_adult'] . ' Yetişkin';
                                    if (count($room['child_ages']) > 0) {
                                        $itemName .= ' ' . count($room['child_ages']) . ' Çocuk';
                                    }
                                    $itemName .= ' Konaklama Bedeli.';
                                    $subTotal = $room['price'] * (1 - $this->getSettingBookingTax->rate / 100);
                                    $tax = $this->getSettingBookingTax->rate * $room['price'] / 100;
                                    $total = $room['price'];
                                    $document->items()->create([
                                        'item_id' => null,
                                        'name' => $itemName,
                                        'description' => '',
                                        'price' => $subTotal,
                                        'quantity' => 1,
                                        'tax_name' => $this->getSettingBookingTax->name,
                                        'tax_rate' => $this->getSettingBookingTax->rate,
                                        'tax' => $tax,
                                        'total' => $total,
                                        'discount' => 0,
                                        'grand_total' => $room['price'],
                                    ]);
                                    $document->total()->create([
                                        'type' => 'subtotal',
                                        'sort_order' => 1,
                                        'amount' => $subTotal,
                                    ]);
                                    $document->total()->create([
                                        'type' => 'tax',
                                        'sort_order' => 2,
                                        'amount' => $tax,
                                    ]);
                                    $document->total()->create([
                                        'type' => 'total',
                                        'sort_order' => 3,
                                        'amount' => $total,
                                    ]);
                                }
                                foreach ($room['daily_prices'] as $daily_price) {
                                    BookingDailyPrice::firstOrCreate([
                                        'booking_room_id' => $bookingRoom->id,
                                        'date' => $daily_price['date'],
                                        'original_price' => $daily_price['original_price'],
                                        'discount' => $daily_price['discount'],
                                        'price' => $daily_price['price'],
                                        'currency' => $webhookData['currency'],
                                    ], [
                                        'original_price' => $daily_price['original_price'],
                                        'discount' => $daily_price['discount'],
                                        'price' => $daily_price['price'],
                                        'currency' => $webhookData['currency'],
                                    ]);
                                }
                            }

                        }
                        $this->channelManager->confirmReservation($webhookData['message_uid'], $booking->booking_code);
                        return [
//                            'message' => 'Booking ' . $webhookData['reason'] . ' successfully',
                            'status' => 'ok',
//                            'data' => $webhookData,
                        ];
                    }
                    return [
//                            'message' => 'Booking ' . $webhookData['reason'] . ' successfully',
                        'status' => 'error',
//                            'data' => $webhookData,
                    ];
                }

                if ($webhookData['reason'] === 'confirm') {
                    $customer = Customer::firstOrCreate(['title' => $customerData['title'], 'tax_number' =>
                        $customerData['tax_number'], 'email' => $customerData['email'], 'phone' => $customerData['phone']],
                        $customerData);
                    $booking_data = [
                        'booking_code' => $webhookData['hr_number'],
                        'customer_id' => $customer->id,
                        'channel_id' => $channel_id,
                        'number_of_rooms' => $webhookData['total_rooms'],
                        'number_of_adults' => $webhookData['total_guests'],
                        'number_of_children' => 0,
                        'calendar_colors' => json_encode($this->getRandomColors(), JSON_THROW_ON_ERROR),
                    ];
                    $booking = Booking::create($booking_data);
                    $booking->cMBooking()->create([
                        'cm_booking_code' => $webhookData['hr_number'],
                    ]);
                    foreach ($webhookData['rooms'] as $room) {
                        $CMRoom = CMRoom::where('room_code', str_replace('HR:', '', $room['code']))->first();
                        if ($CMRoom !== null) {
                            $typeHasViewsRooms = $CMRoom->typeHasView->rooms->pluck('id');
                            $unavailableRIDSDiff = array_intersect($unavailableRoomsIds, $typeHasViewsRooms->toArray());
                            $availableStockRoomsIds = collect(array_diff($typeHasViewsRooms->toArray(),
                                $unavailableRIDSDiff))
                                ->flatten();
                            $randomRoom = Room::find($availableStockRoomsIds->random(1)->first());
                            $bookingRoom = BookingRoom::withoutEvents(static function () use (
                                $booking, $randomRoom, $room
                            ) {
                                return BookingRoom::create([
                                    'booking_id' => $booking->id,
                                    'room_id' => $randomRoom->id,
                                    'check_in' => $room['checkin_date'],
                                    'check_out' => $room['checkout_date'],
                                    'number_of_adults' => $room['total_adult'],
                                    'number_of_children' => count($room['child_ages']),
                                    'children_ages' => json_encode($room['child_ages'], JSON_THROW_ON_ERROR),
                                    'created_at' => Carbon::now(),
                                    'updated_at' => Carbon::now(),
                                ]);
                            });
                            $unavailableRoomsIds[] = $randomRoom->id;
                            $document = $bookingRoom->documents()->create([
                                'type' => 'invoice',
                                'customer_id' => $customer->id,
                                'status' => 'received',
                                'currency' => $webhookData['currency'],
                                'currency_rate' => 1, //TODO: Burada merkez bankasından döviz kuru alınabilir.
                                'issue_date' => $room['checkin_date'],
                                'due_date' => $room['checkout_date'],
                            ]);
                            $itemName = $randomRoom->TypeAndViewName . ' (' . Carbon::parse($room['checkin_date'])->format('d.m.Y') . ' - '
                                . Carbon::parse($room['checkout_date'])->format('d.m.Y') . ') ' . $room['nights'] . ' Gece ' .
                                $room['total_adult'] . ' Yetişkin';
                            if (count($room['child_ages']) > 0) {
                                $itemName .= ' ' . count($room['child_ages']) . ' Çocuk ';
                            }
                            $itemName .= 'Konaklama Bedeli.';
                            $subTotal = $room['price'] * (1 - $this->getSettingBookingTax->rate / 100);
                            $tax = $this->getSettingBookingTax->rate * $room['price'] / 100;
                            $total = $room['price'];
                            $document->items()->create([
                                'item_id' => null,
                                'name' => $itemName,
                                'description' => '',
                                'price' => $subTotal,
                                'quantity' => 1,
                                'tax_name' => $this->getSettingBookingTax->name,
                                'tax_rate' => $this->getSettingBookingTax->rate,
                                'tax' => $tax,
                                'total' => $total,
                                'discount' => 0,
                                'grand_total' => $room['price'],
                            ]);
                            $document->total()->create([
                                'type' => 'subtotal',
                                'sort_order' => 1,
                                'amount' => $subTotal,
                            ]);
                            $document->total()->create([
                                'type' => 'tax',
                                'sort_order' => 2,
                                'amount' => $tax,
                            ]);
                            $document->total()->create([
                                'type' => 'total',
                                'sort_order' => 3,
                                'amount' => $total,
                            ]);
                            foreach ($room['daily_prices'] as $daily_price) {
                                BookingDailyPrice::firstOrCreate([
                                    'booking_room_id' => $bookingRoom->id,
                                    'date' => $daily_price['date'],
                                    'original_price' => $daily_price['original_price'],
                                    'discount' => $daily_price['discount'],
                                    'price' => $daily_price['price'],
                                    'currency' => $webhookData['currency'],
                                ], [
                                    'original_price' => $daily_price['original_price'],
                                    'discount' => $daily_price['discount'],
                                    'price' => $daily_price['price'],
                                    'currency' => $webhookData['currency'],
                                ]);
                            }
                        }
                    }
                    $this->channelManager->confirmReservation($webhookData['message_uid'], $booking->booking_code);
                    return [
//                        'message' => 'Booking ' . $webhookData['reason'] . ' successfully',
                        'status' => 'ok',
//                        'data' => $webhookData,
                    ];
                } else {
                    return [
//                        'message' => 'The request was not understood.',
                        'status' => 'error',
//                        'data' => $webhookData,
                    ];
                }
            } else {
                return [
//                    'message' => 'There is not enough room inventory available. Please try again later.',
                    'status' => 'error',
//                    'data' => $webhookData,
                ];
            }
        });
    }

    /**
     * @return array
     * @throws RandomException
     */
    protected function getRandomColors(): array
    {
        $maxBrightness = 200;  // Minimum brightness for background color
//        $minTextColorDiff = 150;  // Minimum difference in brightness for text color
        $maxAttempts = 10;  // Maximum attempts to find suitable colors

        $attempts = 0;
        do {
            // Generate a random background color
            $backgroundColor = "#" . str_pad(dechex(random_int(0, 0xFFFFFF)), 6, '0', STR_PAD_LEFT);

            // Calculate brightness of the background color
            [$r, $g, $b] = sscanf($backgroundColor, "#%02x%02x%02x");
            $brightness = ($r * 299 + $g * 587 + $b * 114) / 1000;

            $attempts++;

            // Check if the brightness and contrast conditions are met
        } while ($brightness > $maxBrightness && $attempts < $maxAttempts);

        // Calculate text color based on background brightness
        $textColor = ($brightness > 128) ? "#000000" : "#FFFFFF";

        // Calculate a slightly darker border color
        [$r, $g, $b] = sscanf($backgroundColor, "#%02x%02x%02x");
        $borderColorR = max(0, $r - 20);
        $borderColorG = max(0, $g - 20);
        $borderColorB = max(0, $b - 20);
        $borderColor = sprintf("#%02x%02x%02x", $borderColorR, $borderColorG, $borderColorB);

        return array(
            "backgroundColor" => $backgroundColor,
            "textColor" => $textColor,
            "borderColor" => $borderColor
        );
    }
}
