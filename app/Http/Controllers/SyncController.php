<?php

namespace App\Http\Controllers;
set_time_limit(0);

use App\Helpers\Currencies;
use App\Models\BookingDailyPrice;
use App\Models\BookingRoom;
use App\Models\CMBooking;
use App\Models\Hotel;
use App\Models\Tax;
use App\Models\Tenant;
use App\Settings\HotelSettings;
use App\Settings\PricingPolicySettings;
use Config;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use JsonException;

class SyncController extends Controller
{

    public Client $client;

    public string $apiDomain = 'https://app.hotelrunner.com/api/v2/apps/reservations?token=%s&hr_id=%s&per_page=100&undelivered=false&reservation_number=%s';

    public string $hr_id = '';

    public string $token = '';

    protected Currencies $currencies;

    public function __construct()
    {
        $this->client = new Client();
        $this->currencies = new Currencies();
    }

    public function index()
    {
        foreach (Tenant::all() as $tenant) {
            $tenant->run(/**
             * @throws GuzzleException
             * @throws JsonException
             */ function () {
                $apiSetting = new HotelSettings();
                $hotelSettings = new PricingPolicySettings();
                if ($apiSetting->channel_manager['value'] !== 'closed') {
                    $bookingRooms = BookingRoom::where('check_in', '=', '0000-00-00 00:00:00')->where('check_out', '=', '0000-00-00 00:00:00')->get();
                    if ($bookingRooms->count() > 0) {
                        foreach ($bookingRooms as $key => $bookingRoom) {
                            $hrBookingCode = $bookingRoom->booking->cMBooking->cm_booking_code;
                            $request = $this->client->get(sprintf($this->apiDomain, $apiSetting->api_settings['token'], $apiSetting->api_settings['hr_id'], $hrBookingCode));
                            $response = json_decode($request->getBody()->getContents(), true, 512, JSON_THROW_ON_ERROR);
                            $reservation = $response['reservations'][0];
                            BookingRoom::withoutEvents(static function () use ($bookingRoom, $key, $reservation, $hotelSettings) {
                                $bookingRoom->update([
                                    'check_in' => Carbon::createFromFormat('Y-m-d H:i:s', $reservation['rooms'][$key]['checkin_date'] . ' '
                                        . $hotelSettings->check_in_time_policy['value'] . ':00')
                                        ->format('Y-m-d H:i:s'),
                                    'check_out' => Carbon::createFromFormat('Y-m-d H:i:s', $reservation['rooms'][$key]['checkout_date'] . ' '
                                        . $hotelSettings->check_out_time_policy['value'] . ':00')->format('Y-m-d H:i:s'),
                                    'number_of_adults' => $reservation['rooms'][$key]['total_adult'],
                                    'number_of_children' => count($reservation['rooms'][$key]['child_ages']),
                                    'children_ages' => $reservation['rooms'][$key]['child_ages'],
                                ]);
                            });
                            if ($hotelSettings->currency['value'] !== $reservation['currency']) {
                                $currencyConvert = $this->currencies->convert($reservation['currency'], $hotelSettings->currency['value'], 1);
                                if ($currencyConvert['status']) {
                                    $documentCurrency = $currencyConvert['to_currency'];
                                    $currencyRate = $currencyConvert['exchange_rate'];
                                } else {
                                    $documentCurrency = $reservation['currency'];
                                    $currencyRate = 1;
                                }
                            } else {
                                $documentCurrency = $reservation['currency'];
                                $currencyRate = 1;
                            }

                            $bookingRoom->documents[$key]->update([
                                'type' => 'invoice',
                                'customer_id' => $bookingRoom->booking->customer->id,
                                'status' => 'received',
                                'currency' => $documentCurrency,
                                'currency_rate' => $currencyRate,
                                'issue_date' => $reservation['rooms'][$key]['checkin_date'],
                                'due_date' => $reservation['rooms'][$key]['checkout_date'],
                            ]);
                            $itemName = $bookingRoom->room->TypeAndViewName . ' (' . Carbon::parse($reservation['rooms'][$key]['checkin_date'])->format('d.m.Y') . ' - '
                                . Carbon::parse($reservation['rooms'][$key]['checkout_date'])->format('d.m.Y') . ') ' . $reservation['rooms'][$key]['nights'] . ' Gece ' .
                                $reservation['rooms'][$key]['total_adult'] . ' Yetişkin';
                            if (count($reservation['rooms'][$key]['child_ages']) > 0) {
                                $itemName .= ' ' . count($reservation['rooms'][$key]['child_ages']) . ' Çocuk ';
                            }

                            $getTax = Tax::find($hotelSettings->tax_rate['value']);
                            $itemName .= 'Konaklama Bedeli.';

                            $price = $reservation['rooms'][$key]['price'] * $currencyRate;
                            $subTotal = $price * (1 - $getTax->rate / 100);
                            $tax = $getTax->rate * $price / 100;
                            $total = $price;

                            $bookingRoom->documents[$key]->items[0]->update([
                                'item_id' => null,
                                'name' => $itemName,
                                'description' => '',
                                'price' => $subTotal,
                                'quantity' => 1,
                                'tax_name' => $getTax->name,
                                'tax_rate' => $getTax->rate,
                                'tax' => $tax,
                                'total' => $total,
                                'discount' => 0,
                                'grand_total' => $price,
                            ]);

                            $bookingRoom->documents[$key]->total->filter(static function ($total) {
                                return $total->type === 'subtotal';
                            })->first()->update([
                                'sort_order' => 1,
                                'amount' => $subTotal,
                            ]);
                            $bookingRoom->documents[$key]->total->filter(static function ($total) {
                                return $total->type === 'tax';
                            })->first()->update([
                                'sort_order' => 2,
                                'amount' => $tax,
                            ]);
                            $bookingRoom->documents[$key]->total->filter(static function ($total) {
                                return $total->type === 'total';
                            })->first()->update([
                                'sort_order' => 3,
                                'amount' => $total,
                            ]);
                            foreach ($reservation['rooms'][$key]['daily_prices'] as $daily_price) {
                                $bookingRoom->prices->each(static function ($price) use ($daily_price, $currencyRate, $documentCurrency, $bookingRoom) {
                                    if ($price->date === $daily_price['date']) {
                                        $price->update([
                                            'original_price' => $daily_price['original_price'] * $currencyRate,
                                            'discount' => $daily_price['discount'] * $currencyRate,
                                            'price' => $daily_price['price'] * $currencyRate,
                                            'currency' => $documentCurrency,
                                        ]);
                                    } else {
                                        BookingDailyPrice::firstOrCreate([
                                            'booking_room_id' => $bookingRoom->id,
                                            'date' => $daily_price['date'],
                                            'original_price' => $daily_price['original_price'] * $currencyRate,
                                            'discount' => $daily_price['discount'] * $currencyRate,
                                            'price' => $daily_price['price'] * $currencyRate,
                                            'currency' => $documentCurrency,
                                        ], [
                                            'original_price' => $daily_price['original_price'],
                                            'discount' => $daily_price['discount'],
                                            'price' => $daily_price['price'],
                                            'currency' => $documentCurrency,
                                        ]);
                                    }
                                });
                            }
                        }
                    }
                }

            });
        }
    }
}
