<?php

namespace App\Http\Controllers;

use App\Http\Requests\WebHookRequest;
use App\Models\Booking;
use App\Models\BookingChannel;
use App\Models\BookingDailyPrice;
use App\Models\BookingRoom;
use App\Models\BookingTotalPrice;
use App\Models\CMRoom;
use App\Models\Customer;
use App\Models\Tenant;
use App\Models\TypeHasView;
use Carbon\Carbon;

class BookingWebhookController extends Controller
{
    public function handleWebhook(Tenant $tenant, WebHookRequest $request)
    {
        $webhookData = json_decode($request->data, true);
        if ($tenant === null) {
            return [
                'message' => 'Tenant not found',
                'data' => $webhookData,
            ];
        } else {
            $tenant->run(function () use ($webhookData) {
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
                $customer = Customer::firstOrCreate(['title' => $customerData['title'], 'tax_number' =>
                    $customerData['tax_number'], 'email' => $customerData['email'], 'phone' => $customerData['phone']],
                    $customerData);
                $channel = BookingChannel::where('code', $webhookData['channel'])->first();
                if ($channel === null) {
                    $channel_id = 120;
                } else {
                    $channel_id = $channel->id;
                }
                $booking_data = [
                    'booking_code' => $webhookData['hr_number'],
                    'customer_id' => $customer->id,
                    'check_in' => $webhookData['checkin_date'],
                    'check_out' => $webhookData['checkout_date'],
                    'channel_id' => $channel_id, //reception_id
                    'number_of_rooms' => $webhookData['total_rooms'],
                    'number_of_adults' => $webhookData['total_guests'],
                    'number_of_children' => 0,
                ];
                $booking = Booking::create($booking_data);
                $bookingTotalPrice = BookingTotalPrice::create([
                    'booking_id' => $booking->id,
                    'price' => $webhookData['sub_total'],
                    'discount' => 0,
                    'total_price' => $webhookData['sub_total'],
                    'tax' => $webhookData['tax_total'],
                    'grand_total' => $webhookData['total'],
                    'currency' => $webhookData['currency'],
                ]);
                $unavailableRoomsIds = Booking::getUnavailableRoomsIds($webhookData['checkin_date'], $webhookData['checkout_date']);
                foreach ($webhookData['rooms'] as $room) {
                    $cmRoom = CMRoom::where('room_code', str_replace('HR:', '', $room['code']))->first();
                    $randomRoom = TypeHasView::where('id', $cmRoom->type_has_view_id)->with(['rooms' => function ($query) use ($unavailableRoomsIds) {
                        $query->whereNotIn('id', $unavailableRoomsIds);
                    }])->whereHas('rooms')->first()->rooms->first();
                    $bookingRoom = BookingRoom::withoutEvents(function () use ($booking, $randomRoom, $webhookData) {
                        return BookingRoom::create([
                            'booking_id' => $booking->id,
                            'room_id' => $randomRoom->id,
                            'number_of_adults' => $webhookData['total_guests'] / $webhookData['total_rooms'],
                            'number_of_children' => 0,
                            'children_ages' => json_encode(null),
                            'created_at' => Carbon::now(),
                            'updated_at' => Carbon::now(),
                        ]);
                    });
                    $unavailableRoomsIds[] = $randomRoom->id;
                    foreach ($room['daily_prices'] as $daily_price) {
                        BookingDailyPrice::firstOrCreate([
                            'booking_total_price_id' => $bookingTotalPrice->id,
                            'booking_room_id' => $bookingRoom->id,
                            'date' => $daily_price['date'],
                        ], [
                            'original_price' => $daily_price['original_price'],
                            'discount' => $daily_price['discount'],
                            'price' => $daily_price['price'],
                            'currency' => $webhookData['currency'],
                        ]);
                    }
                }
            });
            return [
                'message' => 'Booking created successfully',
                'data' => $webhookData,
            ];
        }
    }
}
