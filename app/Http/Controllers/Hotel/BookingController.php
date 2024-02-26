<?php

namespace App\Http\Controllers\Hotel;

use App\Helpers\PriceCalculator;
use App\Http\Controllers\Controller;
use App\Http\Requests\BookingCreateStepFiveStoreRequest;
use App\Http\Requests\BookingCreateStepFourStoreRequest;
use App\Http\Requests\BookingStepOneRequest;
use App\Http\Requests\BookingStepTwoRequest;
use App\Http\Requests\StoreBookingRequest;
use App\Http\Requests\UpdateBookingRequest;
use App\Models\Booking;
use App\Models\BookingGuests;
use App\Models\BookingRooms;
use App\Models\CaseAndBanks;
use App\Models\Customer;
use App\Models\Guest;
use App\Models\Room;
use App\Models\TypeHasView;
use App\Settings\PricingPolicySettings;
use Carbon\Carbon;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

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
        return Booking::orderBy('id', 'desc')->with(['customer', 'rooms', 'amount'])
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
                'amount' => $booking->amount ? $booking->amount->grand_total : null,
                'amount_formatted' => $booking->amount ? number_format($booking->amount->grand_total, 2, '.', ',') . ' ' . $this->settings->currency['value'] : null,
                'remaining_balance' => $booking->amount ? $booking->remainingBalance() : null,
                'remaining_balance_formatted' => $booking->amount ? number_format($booking->remainingBalance(), 2, '.', ',') . ' ' . $this->settings->currency['value'] : null,
            ]);
    }

    public function calendar(): \Inertia\Response
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
            },
        ])
            ->whereHas('rooms', function ($query) use ($unavailableRoomsIds) {
                $query->whereNotIn('id', $unavailableRoomsIds);
            })
            ->whereHas('type', function ($query) use ($request) {
                $query->with(['beds', 'features'])->where('adult_capacity', '>=', $request->number_of_adults)->where('child_capacity', '>=', $request->number_of_children);
            })
            ->get()
            ->map(function ($typeHasViews) use ($request, $priceCalculator, $nightCount) {
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
                    'price' => $priceCalculator->getNormalPrices(
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
        $booking_data = [
            'customer_id' => $data['customer_id'],
            'check_in' => Carbon::createFromFormat('d.m.Y', $data['booking_result']['check_in'])->format('Y-m-d'),
            'check_out' => Carbon::createFromFormat('d.m.Y', $data['booking_result']['check_out'])->format('Y-m-d'),
            'number_of_rooms' => collect($data['booking_result']['typed_rooms'])->sum('count'),
            'number_of_adults' => $data['booking_result']['number_of_adults_total'],
            'number_of_children' => $data['booking_result']['number_of_children_total'],
        ];
        $booking = Booking::create($booking_data);
        collect($data['checked_rooms'])->each(function ($room) use ($booking) {
            $booking->rooms()->attach($room, ['check_in' => 0]);
        });
        $amount_data = [
            'price' => $data['grand_total'],
            'campaign' => 0,
            'discount' => $data['discount'],
            'total_price' => $data['grand_total'],
            'tax' => $data['grand_total'] * $this->settings->tax_rate['value'] / 100,
            'grand_total' => $data['grand_total'] + ($data['grand_total'] * $this->settings->tax_rate['value'] / 100),
        ];
        $booking->amount()->create($amount_data);
        collect($data['rooms_guests'])->each(function ($room_ytpe, $key) use ($booking) {
            collect($room_ytpe)->each(function ($guest, $key) use ($booking) {
                foreach ($guest as $value) {
                    $guest = Guest::create(
                        [
                            'name' => $value['name'],
                            'surname' => $value['surname'],
                            'nationality' => $value['nationality'],
                            'gender' => $value['gender'],
                            'date_of_birth' => Carbon::createFromFormat('d.m.Y', $value['date_of_birth'])->format('Y-m-d'),
                            'identification_number' =>  $value['identification_number'],
                        ]
                    );
                    BookingRooms::where('booking_id', $booking->id)->where('room_id', $key)->first()->guests()->attach($guest);
                }
            });
        });
        return redirect()->route('hotel.bookings.index')->with('success', 'Rezervasyon başarıyla oluşturuldu.');
    }

    /*
     * Store a newly created resource in storage.
     */

    /**
     * @return \Inertia\Response
     */
    public function create(): \Inertia\Response
    {
        return Inertia::render('Hotel/Booking/Create');
    }

    /**
     * Display the specified resource.
     */
    public function show(Booking $booking)
    {
        return [
            'currency' => $this->settings->currency['value'],
            'booking' => [
                'id' => $booking->id,
                'check_in' => Carbon::parse($booking->check_in)->format('d.m.Y'),
                'check_out' => $booking->check_out != NULL ? Carbon::parse($booking->check_out)->format('d.m.Y') : NULL,
                'number_of_adults' => $booking->rooms->sum('pivot.number_of_adults'),
                'number_of_children' => $booking->rooms->sum('pivot.number_of_children'),
                'open_booking' => $booking->check_out === null ? 'Evet' : 'Hayır',
                'stay_duration_day' => $booking->scopeStayDurationDay(),
                'stay_duration_night' => $booking->scopeStayDurationNight(),
                /*'children_ages' => $booking->children_ages,*/
                'rooms' => $booking->rooms->map(fn($room) => [
                    'name' => $room->name,
                    'room_type' => $room->roomType->name,
                    'room_view' => $room->roomView->name,
                    'room_type_full_name' => $room->roomType->name . ' ' . $room->roomView->name,
                    'quests' => BookingGuests::where('booking_room_id', $room->pivot->id)->get()->map(fn($booking_room)
                    => [
                        'booking_guests_id' => $booking_room->id,
                        'id' => $booking_room->guest->id,
                        'name' => $booking_room->guest->name,
                        'surname' => $booking_room->guest->surname,
                        'birth_date' => $booking_room->guest->date_of_birth,
                        'nationality' => $booking_room->guest->nationality,
                        'identification_number' => $booking_room->guest->identification_number,
                    ]),
                ]),
            ],
            'customer' => [
                'id' => $booking->customer->id,
                'title' => $booking->customer->title,
                'type' => $booking->customer->type == 'individual' ? 'Bireysel' : 'Kurumsal',
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
                'id' => $booking->amount->id,
                'price' => $booking->amount->price,
                'price_formatted' => number_format($booking->amount->price, 2, '.', ',') . ' ' . $this->settings->currency['value'],
                'campaign' => $booking->amount->campaign,
                'discount' => $booking->amount->discount,
                'discount_formatted' => number_format($booking->amount->discount, 2, '.', ',') . ' ' . $this->settings->currency['value'],
                'total_price' => $booking->amount->total_price,
                'total_price_formatted' => number_format($booking->amount->total_price, 2, '.', ',') . ' ' . $this->settings->currency['value'],
                'tax_rate' => $this->settings->tax_rate['value'],
                'tax' => $booking->amount->tax,
                'tax_formatted' => number_format($booking->amount->tax, 2, '.', ',') . ' ' . $this->settings->currency['value'],
                'grand_total' => $booking->amount->grand_total,
                'grand_total_formatted' => number_format($booking->amount->grand_total, 2, '.', ',') . ' ' . $this->settings->currency['value'],
            ],
            'case_and_banks' => CaseAndBanks::select(['id', 'name'])->get(),
            'remaining_balance' => round($booking->remainingBalance(), 2),
            'remaining_balance_formatted' => number_format($booking->remainingBalance(), 2, '.', ',') . ' ' . $this->settings->currency['value']
        ];
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
        //
    }
}
