<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\ChannelManagers;
use App\Helpers\Currencies;
use App\Http\Controllers\Controller;
use App\Http\Requests\HotelChannelManagerStoreRequest;
use App\Http\Requests\StoreCMRoomRequest;
use App\Http\Requests\StoreHotelsRequest;
use App\Http\Requests\UpdateHotelsRequest;
use App\Mail\Hotel\ReservationMail;
use App\Models\Booking;
use App\Models\BookingChannel;
use App\Models\BookingDailyPrice;
use App\Models\BookingRoom;
use App\Models\CMBooking;
use App\Models\CMRoom;
use App\Models\Customer;
use App\Models\District;
use App\Models\Hotel;
use App\Models\Province;
use App\Models\Room;
use App\Models\Tax;
use App\Models\TaxOffice;
use App\Models\Tenant;
use App\Models\TypeHasView;
use App\Settings\HotelSettings;
use App\Settings\PricingPolicySettings;
use Carbon\Carbon;
use GuzzleHttp\Exception\GuzzleException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Response;
use Inertia\Inertia;
use Spatie\LaravelSettings\Migrations\SettingsMigrator;
use JsonException;
use Teknomavi\Tcmb\Exception\UnknownPriceType;


class HotelController extends Controller
{
    protected SettingsMigrator $migrator;

    public function __construct()
    {
        $this->migrator = app(SettingsMigrator::class);
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Admin/Hotel/Index', [
            'filters' => Request::all('search', 'trashed'),
            'hotels' => Hotel::select([
                'id',
                'tenant_id',
                'status',
                'name',
                'register_date',
                'renew_date',
                'price',
                'renew_price',
                'title',
                'address',
                'province_id',
                'district_id',
                'location',
                'tax_office_id',
                'tax_number',
                'phone',
                'email',
            ])->orderBy('id', 'desc')
                ->filter(Request::only('search', 'trashed'))
                ->paginate(Request::get('per_page') ?? 10)
                ->withQueryString()
                ->through(function ($hotel) {
                    return [
                        ...$hotel->toArray(),
                        'province' => $hotel->province->name,
                        'district' => $hotel->district->name,
                        'tax_office' => $hotel->tax_office?->tax_office,
                        'panel_url' => 'https://' . $hotel->tenant->domains->first()->domain . '/',
                        'webhook_url' => 'https://otelyonet.com/api/' . $hotel->tenant->id . '/webhook/booking',
                    ];
                }),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreHotelsRequest $request): \Illuminate\Http\RedirectResponse
    {
        $data = $request->validated();
        $tenant = Tenant::create();
        $tenant->domains()->create(['domain' => $data['subdomain'] . '.otelyonet.com']);

        $data['status'] = 'active';
        $data['register_date'] = Carbon::parse($data['register_date'])->format('Y-m-d');
        $data['renew_date'] = Carbon::parse($data['renew_date'])->format('Y-m-d');
        $tenant->hotel()->create([
            'status' => $data['status'],
            'name' => $data['name'],
            'register_date' => $data['register_date'],
            'renew_date' => $data['renew_date'],
            'price' => $data['price'],
            'renew_price' => $data['renew_price'],
            'title' => $data['title'],
            'address' => $data['address'],
            'province_id' => $data['province_id'],
            'district_id' => $data['district_id'],
            'tax_office_id' => $data['tax_office_id'],
            'tax_number' => $data['tax_number'],
            'phone' => $data['phone'],
            'email' => $data['email'],
        ]);
        return redirect()->route('admin.hotels.index')->with('success', 'Otel oluşturuldu.');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): \Inertia\Response
    {
        return Inertia::render('Admin/Hotel/Create', [
            'provinces' => Province::all(['id', 'name']),
            'districts' => District::all(['id', 'province_id', 'name']),
            'tax_offices' => TaxOffice::all(['id', 'province_id', 'tax_office']),
        ]);
    }

    /**
     * Display the specified resource.
     * @throws GuzzleException|JsonException
     */
    public function show(Hotel $hotel)
    {
        $tenant = $hotel->tenant;
        $returnData['hotel'] = [
            ...$hotel->toArray(),
            'province' => $hotel->province->name,
            'district' => $hotel->district->name,
            'tax_office' => $hotel->tax_office?->tax_office,
            'panel_url' => 'https://' . $hotel->tenant->domains->first()->domain . '/',
            'webhook_url' => 'https://otelyonet.com/api/' . $hotel->tenant->id . '/webhook/booking',
        ];
        $tenant->run(function () use ($hotel, &$returnData) {
            $settings = new HotelSettings();
            $typeHasViews = TypeHasView::all();
            $returnData['tenant'] = [
                ...$hotel->tenant->toArray(),
                'domains' => $hotel->tenant->domains->pluck('domain'),
                'settings' => $settings->toArray(),
            ];
            $returnData['type_has_views'] = $settings->channel_manager['value'] !== 'closed' ? $typeHasViews->map(function ($typeHasView) {
                return [
                    'id' => $typeHasView->id,
                    'name' => $typeHasView->type->name . ' ' . $typeHasView->view->name,
                    'stock' => $typeHasView->rooms->count(),
                    'adult_capacity' => $typeHasView->type->adult_capacity,
                    'child_capacity' => $typeHasView->type->child_capacity,
                    'cm_connected' => CMRoom::where('type_has_view_id', $typeHasView->id)->exists(),
                ];
            })->toArray() : [];
            $returnData['cmError'] = false;
            if ($settings->channel_manager['value'] !== 'closed') {
                $channelManagers = new ChannelManagers($settings->channel_manager['value'], ['token' => $settings->api_settings['token'], 'hr_id' => $settings->api_settings['hr_id']]);
                try {
                    $channelManagerRooms = $channelManagers->getRooms()['rooms'] ?? [];
                } catch (GuzzleException $e) {
                    $channelManagerRooms = [];
                    $returnData['cmError'] = true;
                }
                $collection = collect($channelManagerRooms);
                $uniqueCollection = $collection->count() > 0 ? $collection->unique('inv_code')->values()->all() : [];
                $returnData['cm_rooms'] = CMRoom::all();
                $returnData['channel_rooms'] = $uniqueCollection;
            }
        });
        return Inertia::render('Admin/Hotel/Show', $returnData);
    }

    /**
     */
    public function settings(Hotel $hotel, HotelChannelManagerStoreRequest $request): RedirectResponse
    {
        $tenant = $hotel->tenant;
        $request->validated();
        $tenant->run(function () use ($request) {
            $settings = new HotelSettings();
            $settingsData = $settings->toArray();
            if ($request->channel_manager !== 'closed' && $request->channel_manager !== $settingsData['channel_manager']['value']) {
                $settingsData['channel_manager']['value'] = $request->channel_manager;
                $settingsData['api_settings']['token'] = $request->api_token;
                $settingsData['api_settings']['hr_id'] = $request->api_hr_id;
            } else {
                if ($request->channel_manager === 'closed') {
                    $settingsData['channel_manager']['value'] = $request->channel_manager;
                    $settingsData['api_settings'] = [];
                } else {
                    $settingsData['api_settings']['token'] = $request->api_token;
                    $settingsData['api_settings']['hr_id'] = $request->api_hr_id;
                }
            }
            if ($request->kbs !== 'closed' && $request->kbs !== $settingsData['kbs']['value']) {
                $settingsData['kbs']['value'] = $request->kbs;
                $settingsData['kbs_settings']['TssKod'] = $request->TssKod;
                $settingsData['kbs_settings']['KullaniciTC'] = $request->KullaniciTC;
                $settingsData['kbs_settings']['Sifre'] = $request->Sifre;
            } else {
                if ($request->kbs === 'closed') {
                    $settingsData['kbs']['value'] = $request->kbs;
                    $settingsData['kbs_settings'] = [];
                } else {
                    $settingsData['kbs_settings']['TssKod'] = $request->TssKod;
                    $settingsData['kbs_settings']['KullaniciTC'] = $request->KullaniciTC;
                    $settingsData['kbs_settings']['Sifre'] = $request->Sifre;
                }
            }
            $settings->fill($settingsData);
            $settings->save();
        });

        return redirect()->back()->with(['settings' => 'Ayarlar Güncellendi.']);
    }

    public function setActiveChannels(Hotel $hotel)
    {
        return $hotel->tenant->run(/**
         * @throws GuzzleException|JsonException
         */ function () {
            $settings = new HotelSettings();
            if ($settings->channel_manager['value'] === 'closed') {
                return [
                    'status' => 'error',
                    'message' => 'Kanal yöneticisi kapalı.',
                ];
            }
            $channelManagers = new ChannelManagers($settings->channel_manager['value'], ['token' => $settings->api_settings['token'], 'hr_id' => $settings->api_settings['hr_id']]);
            $connectedChannels = $channelManagers->getChannelList();
            foreach ($connectedChannels['channels'] as $channel) {
                if (BookingChannel::where('code', $channel['code'])->exists()) {
                    BookingChannel::where('code', $channel['code'])->update([
                        'active' => true,
                    ]);
                }
            }
            return [
                'status' => 'success',
                'message' => 'Kanal yöneticileri aktif edildi.',
            ];
        });
    }

    public function retrieveReservations(Hotel $hotel)
    {
        return $hotel->tenant->run(/**
         * @throws GuzzleException|JsonException|UnknownPriceType
         */ function () {
            $hotelSettings = new HotelSettings();
            $settings = new PricingPolicySettings();
            if ($hotelSettings->channel_manager['value'] === 'closed') {
                return false;
            }
            $currencies = new Currencies();
            $getSettingBookingTax = Tax::find($settings->tax_rate['value']);
            $channelManagers = new ChannelManagers($hotelSettings->channel_manager['value'], ['token' => $hotelSettings->api_settings['token'], 'hr_id' => $hotelSettings->api_settings['hr_id']]);
            $page = 1;
            $maxPage = 0;
            $returnShortReservations = [];
            do {
                $reservations = $channelManagers->getReservations($page);
                $maxPage = $reservations['pages'];
                foreach ($reservations['reservations'] as $reservation) {
                    if ($reservation['state'] === 'canceled') {
                        continue;
                    }
                    $unavailableRoomsIds = Booking::getUnavailableRoomsIds(Carbon::createFromFormat('Y-m-d H:i:s', $reservation['checkin_date'] . ' '
                        . $settings->check_in_time_policy['value'] . ':00')
                        ->format('Y-m-d H:i:s'), Carbon::createFromFormat('Y-m-d H:i:s', $reservation['checkout_date'] . ' '
                        . $settings->check_out_time_policy['value'] . ':00')
                        ->format('Y-m-d H:i:s'));
                    $bookableRooms = true;
                    $reservationDataRoomsCollect = collect($reservation['rooms']);
                    CMRoom::whereIn('room_code', $reservationDataRoomsCollect->pluck('inv_code')->unique()->map
                    (function ($code) {
                        return last(explode(':', $code));
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
                    $channel = BookingChannel::where('code', $reservation['channel'])->first();
                    if ($channel === null) {
                        $channel_id = 120;
                    } else {
                        $channel_id = $channel->id;
                    }
                    $customerData = [
                        'title' => $reservation['billing_address']['company'] === '' ? $reservation['guest'] : $reservation['billing_address']['company'],
                        'type' => $reservation['billing_address']['company'] === '' ? 'individual' : 'company',
                        'tax_office' => $reservation['billing_address']['tax_office'],
                        'tax_number' => $reservation['billing_address']['tax_id'] === '' ? '1111111111' : $reservation['billing_address']['tax_id'],
                        'country' => $reservation['billing_address']['country'],
                        'city' => $reservation['billing_address']['city'],
                        'address' => $reservation['billing_address']['street'] . ' ' . $reservation['billing_address']['street_2']
                            . ' ' . $reservation['billing_address']['state'] . ' ' . $reservation['billing_address']['country'],
                        'phone' => $reservation['billing_address']['phone'] === '' ? $reservation['address']['phone'] : $reservation['billing_address']['phone'],
                        'email' => $reservation['billing_address']['email'] === '' ? $reservation['address']['email'] : $reservation['billing_address']['email'],
                    ];
                    if ($bookableRooms) {
                        $customer = Customer::firstOrCreate(['title' => $customerData['title'], 'tax_number' =>
                            $customerData['tax_number'], 'email' => $customerData['email'], 'phone' => $customerData['phone']],
                            $customerData);
                        $booking_data = [
                            'customer_id' => $customer->id,
                            'channel_id' => $channel_id,
                            'number_of_rooms' => $reservation['total_rooms'],
                            'number_of_adults' => $reservation['total_guests'],
                            'number_of_children' => 0,
                            'calendar_colors' => $this->getRandomColors(),
                        ];
                        $booking = Booking::create($booking_data);
                        $booking->cMBooking()->create([
                            'cm_booking_code' => $reservation['hr_number'],
                        ]);
                        if ($settings->currency['value'] !== $reservation['currency']) {
                            $currencyConvert = $currencies->convert($reservation['currency'], $settings->currency['value'], 1);
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
                        foreach ($reservation['rooms'] as $room) {
                            $CMRoom = CMRoom::where('room_code', last(explode(':', $room['inv_code'])))->first();
                            if ($CMRoom !== null) {
                                $typeHasViewsRooms = $CMRoom->typeHasView->rooms?->pluck('id');
                                $unavailableRIDSDiff = array_intersect($unavailableRoomsIds, $typeHasViewsRooms?->toArray() ?? []);
                                $availableStockRoomsIds = collect(array_diff($typeHasViewsRooms->toArray(),
                                    $unavailableRIDSDiff))
                                    ->flatten();
                                if ($availableStockRoomsIds->count() > 0) {
                                    $randomRoom = Room::find($availableStockRoomsIds->random(1)->first());
                                    $bookingRoom = BookingRoom::withoutEvents(static function () use (
                                        $booking, $randomRoom, $room, $settings
                                    ) {
                                        return BookingRoom::create([
                                            'booking_id' => $booking->id,
                                            'room_id' => $randomRoom->id,
                                            'check_in' => Carbon::createFromFormat('Y-m-d H:i:s', $room['checkin_date'] . ' '
                                                . $settings->check_in_time_policy['value'] . ':00')
                                                ->format('Y-m-d H:i:s'),
                                            'check_out' => Carbon::createFromFormat('Y-m-d H:i:s', $room['checkout_date'] . ' '
                                                . $settings->check_out_time_policy['value'] . ':00')->format('Y-m-d H:i:s'),
                                            'number_of_adults' => $room['total_adult'],
                                            'number_of_children' => count($room['child_ages']),
                                            'children_ages' => $room['child_ages'],
                                            'created_at' => Carbon::now(),
                                            'updated_at' => Carbon::now(),
                                        ]);
                                    });
                                    $unavailableRoomsIds[] = $randomRoom->id;
                                    $document = $bookingRoom->documents()->create([
                                        'type' => 'invoice',
                                        'customer_id' => $customer->id,
                                        'status' => 'received',
                                        'currency' => $documentCurrency,
                                        'currency_rate' => $currencyRate,
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
                                    $price = $room['price'] * $currencyRate;
                                    $subTotal = $price * (1 - $getSettingBookingTax->rate / 100);
                                    $tax = $getSettingBookingTax->rate * $price / 100;
                                    $total = $price;
                                    $document->items()->create([
                                        'item_id' => null,
                                        'name' => $itemName,
                                        'description' => '',
                                        'price' => $subTotal,
                                        'quantity' => 1,
                                        'tax_name' => $getSettingBookingTax->name,
                                        'tax_rate' => $getSettingBookingTax->rate,
                                        'tax' => $tax,
                                        'total' => $total,
                                        'discount' => 0,
                                        'grand_total' => $price,
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
                                            'original_price' => $daily_price['original_price'] * $currencyRate,
                                            'discount' => $daily_price['discount'] * $currencyRate,
                                            'price' => $daily_price['price'] * $currencyRate,
                                            'currency' => $documentCurrency,
                                        ], [
                                            'original_price' => $daily_price['original_price'] * $currencyRate,
                                            'discount' => $daily_price['discount'] * $currencyRate,
                                            'price' => $daily_price['price'] * $currencyRate,
                                            'currency' => $documentCurrency,
                                        ]);
                                    }
                                } else {
                                    $returnShortReservations[$page]['$availableStockRoomsIds'][] = $reservation;
                                }
                            } else {
                                $returnShortReservations[$page]['$CMRoom'][] = $reservation;
                            }
                        }
                    } else {
                        $returnShortReservations[$page]['$bookableRooms'][] = $reservation;
                    }
                }
                $page++;
            } while ($page <= $maxPage);
            return $returnShortReservations;
        });
    }

    public function CmRoomsStore(Hotel $hotel, StoreCMRoomRequest $request): RedirectResponse
    {
        $request->cm_room_code = last(explode(':', $request->cm_room_code));
        $hotel->tenant->run(function () use ($request) {
            $cmRoom = CMRoom::where('type_has_view_id', $request->type_has_view_id)
                ->orWhere('room_code', $request->cm_room_code)
                ->first();
            if ($cmRoom) {
                $cmRoom->update([
                    'type_has_view_id' => $request->type_has_view_id,
                    'room_code' => $request->cm_room_code,
                    'stock' => $request->stock,
                ]);
            } else {
                CMRoom::create([
                    'type_has_view_id' => $request->type_has_view_id,
                    'room_code' => $request->cm_room_code,
                    'stock' => $request->stock,
                ]);
            }
        });
        return redirect()->route('admin.hotels.show', $hotel->id)->with('success', 'Oda ataması eklendi.');
    }

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

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateHotelsRequest $request, Hotel $hotel): RedirectResponse
    {
        $request->validated();
        $hotel->fill([
            'status' => $request->status,
            'name' => $request->name,
            'register_date' => Carbon::parse($request->register_date)->format('Y-m-d'),
            'renew_date' => Carbon::parse($request->renew_date)->format('Y-m-d'),
            'price' => $request->price,
            'renew_price' => $request->renew_price,
            'title' => $request->title,
            'address' => $request->address,
            'province_id' => $request->province_id,
            'district_id' => $request->district_id,
            'tax_office_id' => $request->tax_office_id,
            'tax_number' => $request->tax_number,
            'phone' => $request->phone,
            'email' => $request->email,
        ]);
        if ($hotel->isDirty()) {
            $hotel->update($hotel->getDirty());
            return redirect()->back()->with('success', 'Otel güncellendi.');
        }

        return redirect()->back()->with('success', 'Değişiklik yapılmadı.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Hotel $hotel): \Inertia\Response
    {
        return Inertia::render('Admin/Hotel/Edit', [
            'hotel' => [
                ...$hotel->toArray(),
                'subdomain' => explode('.', $hotel->tenant->domains->first()->domain)[0],
            ],
            'provinces' => Province::all(['id', 'name']),
            'districts' => District::all(['id', 'province_id', 'name']),
            'tax_offices' => TaxOffice::all(['id', 'province_id', 'tax_office']),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Hotel $hotel): void
    {
        $hotel->tenant->delete();
        $hotel->forceDelete();
    }
}
