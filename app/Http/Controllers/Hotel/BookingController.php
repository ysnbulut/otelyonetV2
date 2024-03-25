<?php

namespace App\Http\Controllers\Hotel;

use App\Helpers\PriceCalculator;
use App\Http\Controllers\Controller;
use App\Http\Requests\BookingStepOneRequest;
use App\Http\Requests\StoreBookingRequest;
use App\Http\Requests\UpdateBookingRequest;
use App\Models\Booking;
use App\Models\BookingDailyPrice;
use App\Models\BookingGuests;
use App\Models\BookingRoom;
use App\Models\BookingTotalPrice;
use App\Models\CaseAndBank;
use App\Models\Citizen;
use App\Models\Customer;
use App\Models\Guest;
use App\Models\Room;
use App\Models\TypeHasView;
use App\Settings\PricingPolicySettings;
use Carbon\Carbon;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Sqids\Sqids;

class BookingController extends Controller
{
    protected PricingPolicySettings $settings;

    public function __construct()
    {
        $this->settings = new PricingPolicySettings();
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Hotel/Booking/Index', [
            'currency' => $this->settings->currency['value'],
            'filters' => Request::all('search', 'trashed'),
            'bookings' => Booking::getBookings(),
            'can' => [
                'create' => auth()->user()->can('booking.create'),
                'edit' => auth()->user()->can('edit booking'),
                'update' => auth()->user()->can('update booking'),
                'delete' => auth()->user()->can('delete booking'),
                'restore' => auth()->user()->can('restore booking'),
                'forceDelete' => auth()->user()->can('forceDelete booking'),
            ],
        ]);
    }

    public function upcoming()
    {
        //->where('check_in', '>', Carbon::now())
        return Booking::orderBy('id', 'desc')->with(['customer', 'rooms', 'total_price'])
            ->cursorPaginate(10)
            ->withQueryString()
            ->through(fn($booking) => [
                'id' => $booking->id,
                'check_in' => Carbon::parse($booking->check_in)->format('d.m.Y'),
                'check_out' => $booking->check_out != NULL ? Carbon::parse($booking->check_out)->format('d.m.Y') : NULL,
                'open_booking' => $booking->check_out === null,
                'customer_id' => $booking->customer->id,
                'customer' => $booking->customer->title,
                'rooms' => $booking->rooms->pluck('name')->implode(', '), // $booking->rooms->pluck('name')->implode(', ')
                'rooms_count' => $booking->rooms->count(),
                'number_of_adults' => $booking->rooms->sum('pivot.number_of_adults'),
                'number_of_children' => $booking->rooms->sum('pivot.number_of_children'),
                'amount' => $booking->total_price ? $booking->total_price->grand_total : null,
                'amount_formatted' => $booking->total_price ? number_format($booking->total_price->grand_total, 2, '.', ',') . ' ' . $this->settings->currency['value'] : null,
                'remaining_balance' => $booking->total_price ? $booking->remainingBalance() : null,
                'remaining_balance_formatted' => $booking->total_price ? number_format($booking->remainingBalance(), 2, '.', ',') . ' ' . $this->settings->currency['value'] : null,
            ]);
    }

    public function calendar(): Response
    {
        $bookings = Booking::orderBy('id')
            ->with('rooms')
            ->where(column: 'check_out', operator: '>=', value: Carbon::now()->format('Y-m-d'))
            ->orWhereNull('check_out')
            ->get();
        $check_in_time = Str::of($this->settings->check_in_time_policy['value'])->explode(':');
        $check_out_time = Str::of($this->settings->check_out_time_policy['value'])->explode(':');
        return Inertia::render('Hotel/Booking/Calendar', [
            'check_in_time' => $check_in_time[0],
            'check_out_time' => $check_out_time[0],
            'rooms' => Room::with(['building', 'floor', 'roomType', 'roomView'])
                ->orderBy('name')
                ->get()
                ->map(
                    fn($room) => [
                        'id' => $room->id,
                        'title' => $room->name,
                        'building' => $room->building->name,
                        'floor' => $room->floor->name,
                        'type_and_view' => $room->roomType->name . ' ' . $room->roomView->name,
                        'type_id' => $room->roomType->id,
                    ]
                ),
            'bookings' => $bookings->flatMap(callback: function ($booking) {
                return $booking->rooms->map(function ($room) use ($booking) {
                    $randomColors = $this->getRandomColors();
                    return [
                        'id' => $booking->id,
                        'resourceId' => $room->id,
                        'title' => Carbon::createFromFormat('Y-m-d', $booking->check_in)->format('d.m.Y') . ' ' . $booking->check_out . ' ' . $booking->stayDurationNight(),
                        'start' => $booking->check_in . ' ' . $this->settings->check_in_time_policy['value'],
                        'end' => $booking->check_out != null ? $booking->check_out . ' ' .
                            $this->settings->check_out_time_policy['value'] : Carbon::now()->addDays(10)->format('Y-m-d')
                            . ' ' . $this->settings->check_out_time_policy['value'],
                        'backgroundColor' => $randomColors['backgroundColor'],
                        'textColor' => $randomColors['textColor'],
                        'borderColor' => $randomColors['borderColor'],
                    ];
                });
            }),
        ]);
    }

    /**
     * @return array
     */
    protected function getRandomColors(): array
    {
        $maxBrightness = 200;  // Minimum brightness for background color
        $minTextColorDiff = 150;  // Minimum difference in brightness for text color
        $maxAttempts = 10;  // Maximum attempts to find suitable colors

        $attempts = 0;
        do {
            // Generate a random background color
            $backgroundColor = "#" . str_pad(dechex(mt_rand(0, 0xFFFFFF)), 6, '0', STR_PAD_LEFT);

            // Calculate brightness of the background color
            list($r, $g, $b) = sscanf($backgroundColor, "#%02x%02x%02x");
            $brightness = ($r * 299 + $g * 587 + $b * 114) / 1000;

            $attempts++;

            // Check if the brightness and contrast conditions are met
        } while ($brightness > $maxBrightness && $attempts < $maxAttempts);

        // Calculate text color based on background brightness
        $textColor = ($brightness > 128) ? "#000000" : "#FFFFFF";

        // Calculate a slightly darker border color
        list($r, $g, $b) = sscanf($backgroundColor, "#%02x%02x%02x");
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

    public function stepOne(BookingStepOneRequest $request)
    {
        $data = $request->validated();
        switch ($data['booking_type']) {
            case 'normal':
                $reData = $this->stepOneNormal($request);
                break;
            case 'open':
                $reData = $this->stepOneOpen();
                break;
            default:
                $reData = [
                    'status' => 'error',
                    'message' => 'Rezervasyon tipi seçilmedi.',
                ];

        }
        return json_encode($reData);
    }

    public function stepOneNormal($request)
    {
        $priceCalculator = new PriceCalculator();
        $request->check_in = Carbon::createFromFormat('d.m.Y', $request->check_in)->format('Y-m-d');
        $request->check_out = Carbon::createFromFormat('d.m.Y', $request->check_out)->format('Y-m-d');
        $nightCount = Carbon::parse($request->check_in)->diffInDays($request->check_out);
        $dayCount = $nightCount + 1;
        $unavailableRoomsIds = Booking::getUnavailableRoomsIds($request->check_in, $request->check_out);
        $roomResults = TypeHasView::with([
            'view',
            'rooms' => function ($query) use ($unavailableRoomsIds) {
                $query->whereNotIn('id', $unavailableRoomsIds);
            }
        ])->whereHas('rooms', function ($query) use ($unavailableRoomsIds) {
            $query->whereNotIn('id', $unavailableRoomsIds);
        })->whereHas('type', function ($query) use ($request) {
            $query->with(['beds', 'features'])->where('adult_capacity', '>=', $request->number_of_adults)->where('child_capacity', '>=', $request->number_of_children);
        })->get()->map(function ($typeHasViews) use ($request, $priceCalculator, $nightCount) {
            return [
                'id' => $typeHasViews->id,
                'name' => $typeHasViews->type->name . ' ' . $typeHasViews->view->name,
                'photos' => $typeHasViews->type->getMedia('room_type_photos')->map(fn($media) => $media->getUrl()),
                'size' => $typeHasViews->type->size,
                'room_count' => $typeHasViews->type->room_count,
                'available_room_count' => $typeHasViews->rooms->count(),
                'adult_capacity' => $typeHasViews->type->adult_capacity,
                'child_capacity' => $typeHasViews->type->child_capacity,
                'beds' => $typeHasViews->type->beds->map(
                    fn($bed) => [
                        'name' => $bed->name,
                        'person_num' => $bed->person_num,
                        'count' => $bed->pivot->count,
                    ]
                ),
                'features' => $typeHasViews->type->features->map(fn($feature) => $feature->name),
                'rooms' => $typeHasViews->rooms->count() > 0 ? $typeHasViews->rooms->map(
                    fn($room) => [
                        'id' => $room->id,
                        'name' => $room->name,
                    ]
                ) : false,
                'price' => $priceCalculator->prices(
                    $typeHasViews->id,
                    $request->check_in,
                    $request->check_out,
                    $request->number_of_adults,
                    $request->number_of_children,
                    $request->children_ages
                )->first(),
            ];
        });
        return [
            'currency' => $this->settings->currency['value'],
            'request' => $request->all(),
            'night_count' => $nightCount,
            'data' => $roomResults,
            'customers' => Customer::select(['id', 'title', 'type', 'tax_office', 'tax_number', 'country', 'city', 'address', 'phone', 'email'])->get(),
        ];
    }

    public function stepOneOpen()
    {
        return [
            'status' => 'error',
            'message' => 'Açık rezervasyon henüz yapılamıyor.',
        ];
    }

    public function store(StoreBookingRequest $request)
    {
        $data = $request->validated();
        $check_in_required = $data['checkin_required'];
        $selected_room_count = collect($data['booking_result']['typed_rooms'])->sum('count');
        $sqids = new Sqids('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 9);
        do {
            try {
                $uniqueNumber = str_pad(random_int(0, 999999999), 9, '0', STR_PAD_LEFT);
            } catch (\Exception $e) {
                // random_int failed. Fall back to mt_rand
                $uniqueNumber = str_pad(mt_rand(0, 999999999), 9, '0', STR_PAD_LEFT);
            }
        } while (Booking::where('booking_code', 'O'.$sqids->encode([$uniqueNumber]))->exists());
        $booking_data = [
            'booking_code' => 'O'.$sqids->encode([$uniqueNumber]),
            'customer_id' => $data['customer_id'],
            'check_in' => Carbon::createFromFormat('d.m.Y', $data['booking_result']['check_in'])->format('Y-m-d'),
            'check_out' => Carbon::createFromFormat('d.m.Y', $data['booking_result']['check_out'])->format('Y-m-d'),
            'channel_id' => 122, //reception_id
            'number_of_rooms' => collect($data['booking_result']['typed_rooms'])->sum('count'),
            'number_of_adults' => $data['booking_result']['number_of_adults_total'],
            'number_of_children' => $data['booking_result']['number_of_children_total'],
        ];
        $booking = Booking::create($booking_data);
        $number_of_adults = $data['booking_result']['number_of_adults_total'] / $selected_room_count || $data['number_of_adults'];
        $number_of_children = $data['booking_result']['number_of_children_total'] / $selected_room_count || $data['number_of_children'];
        $children_ages = $number_of_children > 0 ? $data['children_ages'] : null;
        $discountRate = $data['discount'] / $data['grand_total'];
        $tax = round($data['grand_total'] - ($data['grand_total'] / (1 +
                    ($this->settings->tax_rate['value'] /
                        100))), 2);
        $bookingTotalPrice = BookingTotalPrice::create([
            'booking_id' => $booking->id,
            'price' => $discountRate > 0 ? $data['grand_total'] / (1 - $discountRate) : $data['grand_total'],
            'discount' => $data['discount'],
            'total_price' => $data['grand_total'],
            'tax' => $tax,
            'grand_total' => $data['grand_total'] + $tax,
            'currency' => $this->settings->currency['value'],
        ]);
        foreach ($data['checked_rooms'] as $room) {
            foreach ($room as $room_id) {
                $bookingRoom = BookingRoom::create([
                    'booking_id' => $booking->id,
                    'room_id' => $room_id,
                    'number_of_adults' => $number_of_adults,
                    'number_of_children' => $number_of_children,
                    'children_ages' => json_encode($children_ages),
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now(),
                ]);
                foreach ($data['daily_prices'] as $dailyPrice) {
                    foreach ($dailyPrice as $price) {
                        BookingDailyPrice::firstOrCreate([
                            'booking_total_price_id' => $bookingTotalPrice->id,
                            'booking_room_id' => $bookingRoom->id,
                            'date' => $price['date'],
                        ], [
                            'original_price' => round($price['price'] * $discountRate) + round($price['price']),
                            'discount' => round($price['price'] * $discountRate),
                            'price' => round($price['price']),
                            'currency' => $this->settings->currency['value'],
                        ]);
                    }

                }

            }
        }
        collect($data['rooms_guests'])->each(function ($room_ytpe, $key) use ($booking, $check_in_required) {
            collect($room_ytpe)->each(function ($guest, $key) use ($booking, $check_in_required) {
                foreach ($guest as $value) {
                    if ($value['name'] != null && $value['surname'] != null && $value['citizen_id'] != null) {
                        $guest = Guest::create(
                            [
                                'name' => $value['name'],
                                'surname' => $value['surname'],
                                'citizen_id' => $value['citizen_id'],
                                'gender' => $value['gender'],
                                'birthday' => Carbon::createFromFormat('d.m.Y', $value['birthday'])->format('Y-m-d'),
                                'identification_number' => $value['identification_number'],
                            ]
                        );
                        BookingRoom::where('booking_id', $booking->id)->where('room_id', $key)->first()->guests()
                            ->attach($guest, ['check_in' => $check_in_required, 'status'
                            => $check_in_required ? 'check_in' : 'pending', 'check_in_date' => $check_in_required ?
                                Carbon::now() : null, 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()]);
                    }

                }
            });
        });
        return redirect()->route('hotel.bookings.index')->with('success', 'Rezervasyon başarıyla oluşturuldu.');
    }

    /*
     * Store a newly created resource in storage.
     */

    /**
     * @return Response
     */
    public function create(): Response
    {
        return Inertia::render('Hotel/Booking/Create', [
            'baby_age_limit' => $this->settings->baby_age_limit['value'],
            'child_age_limit' => $this->settings->child_age_limit['value'],
            'accommodation_type' => $this->settings->accommodation_type['value'],
            'citizens' => Citizen::select(['id', 'name'])->get(),
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Booking $booking)
    {
        $availableDatesCountArr = [];
        return Inertia::render('Hotel/Booking/Show', [
            'currency' => $this->settings->currency['value'],
            'accommodation_type' => $this->settings->accommodation_type['value'],
            'citizens' => Citizen::select(['id', 'name'])->get(),
            'booking' => [
                'id' => $booking->id,
                'channel' => $booking->channel->name,
                'check_in' => Carbon::parse($booking->check_in)->format('d.m.Y'),
                'check_out' => $booking->check_out != NULL ? Carbon::parse($booking->check_out)->format('d.m.Y') : NULL,
                'number_of_rooms' => $booking->number_of_rooms,
                'number_of_adults' => $booking->number_of_adults,
                'number_of_children' => $booking->number_of_children,
                'open_booking' => $booking->check_out === null,
                'stay_duration_days' => $booking->stayDurationDay(),
                'stay_duration_nights' => $booking->stayDurationNight(),
                'rooms' => $booking->rooms->map(function ($room) use (&$availableDatesCountArr, $booking) {
                    $checkinDates = $room->bookings->map(fn($booking) => $booking->check_in)->toArray();
                    $availableDatesCount = 0;
                    for ($i = 1; $i < 8; $i++) {
                        $date = Carbon::parse($booking->check_out)->endOf('day');
                        $date->addDay($i);
                        $dateStr = $date->format('Y-m-d');
                        if (!in_array($dateStr, $checkinDates)) {
                            $availableDatesCount++;
                        } else {
                            break;
                        }
                    }
                    $availableDatesCountArr[] = $availableDatesCount;
                    $bookingGuests = BookingGuests::where('booking_room_id', $room->pivot->id)->get();
                    $canBeCheckoutArr = [];
                    $bookingGuests->each(function ($booking_guest) use (&$canBeCheckoutArr) {
                        if ($booking_guest->check_in && !$booking_guest->check_out) {
                            $canBeCheckoutArr[] = true;
                        } else {
                            $canBeCheckoutArr[] = false;
                        }
                    });
                    return [
                        'booking_room_id' => $room->pivot->id,
                        'id' => $room->id,
                        'name' => $room->name,
                        'room_type' => $room->roomType->name,
                        'room_view' => $room->roomView->name,
                        'room_type_full_name' => $room->roomType->name . ' ' . $room->roomView->name,
                        'number_of_adults' => $room->pivot->number_of_adults,
                        'number_of_children' => $room->pivot->number_of_children,
                        'children_ages' => $room->pivot->children_ages !== null ? json_decode($room->pivot->children_ages) :
                            null,
                        'can_be_check_in' => in_array(false, $canBeCheckoutArr),
                        'can_be_check_out' => in_array(true, $canBeCheckoutArr),
                        'guests' => $bookingGuests->map(fn($booking_guest) => [
                            'booking_guests_id' => $booking_guest->id,
                            'id' => $booking_guest->guest->id,
                            'name' => $booking_guest->guest->name,
                            'surname' => $booking_guest->guest->surname,
                            'birthday' => $booking_guest->guest->birthday,
                            'gender' => $booking_guest->guest->gender,
                            'citizen_id' => $booking_guest->guest->citizen_id,
                            'citizen' => Citizen::find($booking_guest->guest->citizen_id)->name,
                            'identification_number' => $booking_guest->guest->identification_number,
                            'is_check_in' => $booking_guest->check_in,
                            'is_check_out' => $booking_guest->check_out,
                            'status' => $booking_guest->status,
                            'check_in_date' => $booking_guest->check_in_date !== null ? Carbon::parse
                            ($booking_guest->check_in_date)->format('d.m.Y') : null,
                            'check_out_date' => $booking_guest->check_out_date !== null ? Carbon::parse
                            ($booking_guest->check_out_date)->format('d.m.Y') : null,
                            'check_in_kbs' => $booking_guest->check_in_kbs,
                            'check_out_kbs' => $booking_guest->check_out_kbs,
                        ]),
                    ];
                }),
            ],
            'customer' => [
                'id' => $booking->customer->id,
                'title' => $booking->customer->title,
                'type' => $booking->customer->type == 'individual' ? 'Bireysel' : 'Kurumsal',
                'tax_office' => $booking->customer->tax_office,
                'tax_number' => $booking->customer->tax_number,
                'country' => $booking->customer->country,
                'city' => $booking->customer->city,
                'address' => $booking->customer->address,
                'phone' => $booking->customer->phone,
                'email' => $booking->customer->email,
            ],
            'booking_payments' => $booking->customer->payments()->where('booking_id', $booking->id)->get()->map(
                fn($payment) => [
                    'id' => $payment->id,
                    'payment_date' => Carbon::parse($payment->payment_date)->format('d.m.Y'),
                    'case_and_bank' => [
                        'id' => $payment->case->id,
                        'name' => $payment->case->name,
                        'currency' => $payment->case->currency,
                    ],
                    'currency' => $payment->currency,
                    'currency_amount' => $payment->currency_amount,
                    'currency_amount_formatted' => number_format($payment->currency_amount, 2, '.', ',') . ' ' . $payment->currency,
                    'amount_paid' => $payment->amount_paid,
                    'amount_paid_formatted' => number_format($payment->amount_paid, 2, '.', ',') . ' ' . $this->settings->currency['value'],
                    'payment_method' => $payment->payment_method,
                    'description' => $payment->description,
                ]
            ),
            'amount' => [
                'id' => $booking->total_price->id,
                'price' => $booking->total_price->price,
                'price_formatted' => number_format($booking->total_price->price, 2, '.', ',') . ' ' . $this->settings->currency['value'],
                'campaign' => $booking->total_price->campaign,
                'discount' => $booking->total_price->discount,
                'discount_formatted' => number_format($booking->total_price->discount, 2, '.', ',') . ' ' . $this->settings->currency['value'],
                'total_price' => $booking->total_price->total_price,
                'total_price_formatted' => number_format($booking->total_price->total_price, 2, '.', ',') . ' ' . $this->settings->currency['value'],
                'tax_rate' => $this->settings->tax_rate['value'],
                'tax' => $booking->total_price->tax,
                'tax_formatted' => number_format($booking->total_price->tax, 2, '.', ',') . ' ' . $this->settings->currency['value'],
                'grand_total' => $booking->total_price->grand_total,
                'grand_total_formatted' => number_format($booking->total_price->grand_total, 2, '.', ',') . ' ' . $this->settings->currency['value'],
            ],
            'extendable_number_of_days' => min($availableDatesCountArr),
            'case_and_banks' => CaseAndBank::select(['id', 'name'])->get(),
            'remaining_balance' => round($booking->remainingBalance(), 2),
            'remaining_balance_formatted' => number_format($booking->remainingBalance(), 2, '.', ',') . ' ' .
                $this->settings->currency['value'],
            'booking_messages' => $booking->notes,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Booking $booking)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBookingRequest $request, Booking $booking)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Booking $booking)
    {
        $booking->delete();
        return redirect()->route('hotel.bookings.index')->with('success', 'Rezervasyon başarıyla silindi.');
    }
}
