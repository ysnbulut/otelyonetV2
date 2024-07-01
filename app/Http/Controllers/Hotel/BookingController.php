<?php

namespace App\Http\Controllers\Hotel;

use App\Helpers\PriceCalculator;
use App\Http\Controllers\Controller;
use App\Http\Requests\BookingStepOneRequest;
use App\Http\Requests\StoreBookingRequest;
use App\Http\Requests\StoreTransactionRequest;
use App\Http\Requests\UpdateBookingRequest;
use App\Models\Bank;
use App\Models\Booking;
use App\Models\BookingDailyPrice;
use App\Models\BookingGuests;
use App\Models\BookingRoom;
use App\Models\Citizen;
use App\Models\Customer;
use App\Models\Document;
use App\Models\Guest;
use App\Models\Room;
use App\Models\SalesUnit;
use App\Models\Tax;
use App\Models\Transaction;
use App\Models\TypeHasView;
use App\Settings\PricingPolicySettings;
use Carbon\Carbon;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use JsonException;
use Random\RandomException;

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
    public function index(): Response
    {
        return Inertia::render('Hotel/Booking/Index', [
            'currency' => $this->settings->currency['value'],
            'filters' => Request::all('search', 'trashed'),
            'bookings' => Booking::orderBy('id', 'desc')
                ->with(['customer', 'rooms'])
                ->filter(Request::only('search', 'trashed'))
                ->paginate(10)
                ->withQueryString()
                ->through(function ($booking) {
                    $grandTotal = $booking->documents->map(fn($document) => $document->total->filter(fn($total) => $total->type === 'total')->map(fn($total) => $total->amount))->flatten(1)->sum();
                    $remainingBalance = floor($grandTotal - $booking->documents->map(fn($document) => $document->payments->map(fn($payment) => $payment->amount))->flatten(1)->sum());
                    return [
                        'id' => $booking->id,
                        'check_in' => Carbon::parse($booking->rooms->pluck('check_in')->min())->format('d.m.Y'),
                        'check_out' => Carbon::parse($booking->rooms->pluck('check_out')->max())->format('d.m.Y'),
                        'customer_id' => $booking->customer->id,
                        'customer' => $booking->customer->title,
                        'rooms' => $booking->rooms->map(fn($booking_room) => $booking_room->room->name)->implode(', '),
                        'rooms_count' => $booking->rooms->count(),
                        'number_of_adults' => $booking->rooms->sum('pivot.number_of_adults'),
                        'number_of_children' => $booking->rooms->sum('pivot.number_of_children'),
                        'amount' => $grandTotal,
                        'amount_formatted' => number_format($grandTotal, 2, '.', ',') . ' ' . $this->settings->currency['value'],
                        'remaining_balance' => round($remainingBalance, 2),
                        'remaining_balance_formatted' => number_format($remainingBalance, 2, '.', ',') . ' ' . $this->settings->currency['value'],
                    ];
                })
        ]);
    }

    public function upcoming(): \Illuminate\Contracts\Pagination\CursorPaginator
    {
        return BookingRoom::orderBy('check_in', 'asc')->with(['booking', 'room'])->whereDate('check_in', '>=',
            Carbon::now()
                ->format('Y-m-d'))
            ->cursorPaginate(10)
            ->withQueryString()
            ->through(fn($booking_room) => [
                'id' => $booking_room->id,
                'check_in' => Carbon::parse($booking_room->check_in)->format('d.m.Y'),
                'check_out' => Carbon::parse($booking_room->check_out)->format('d.m.Y'),
                'customer_id' => $booking_room->booking->customer->id,
                'customer' => $booking_room->booking->customer->title,
                'rooms' => $booking_room->room->name,
                'number_of_adults' => $booking_room->number_of_adults,
                'number_of_children' => $booking_room->number_of_children,
            ]);
    }

    public function calendar(): Response
    {
        $bookings = Booking::orderBy('id')
            ->with('rooms')
            ->get();
        $check_in_time = Str::of($this->settings->check_in_time_policy['value'])->explode(':');
        $check_out_time = Str::of($this->settings->check_out_time_policy['value'])->explode(':');
        return Inertia::render('Hotel/Booking/Calendar', [ //
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
                    $calendarColors = json_decode($booking->calendar_colors, true, 512, JSON_THROW_ON_ERROR);
                    return [
                        'id' => $booking->id,
                        'resourceId' => $room->room_id,
                        'title' => Carbon::parse($room->check_in)->format('d.m.Y') . ' ' . Carbon::parse
                            ($room->check_out)->format('d.m.Y') . ' ' . $booking->stayDurationNight(),
                        'start' => Carbon::parse($room->check_in),
                        'end' => Carbon::parse($room->check_out),
                        'backgroundColor' => $calendarColors['backgroundColor'],
                        'textColor' => $calendarColors['textColor'],
                        'borderColor' => $calendarColors['borderColor'],
                    ];
                });
            }),
        ]);
    }

    /**
     * @throws JsonException
     * @throws RandomException
     */
    public function store(StoreBookingRequest $request): \Illuminate\Http\RedirectResponse
    {
        $data = $request->validated();
        $getSettingBookingTax = Tax::find($this->settings->tax_rate['value']);
        $check_in_required = $data['checkin_required'];
        $selected_room_count = collect($data['booking_result']['typed_rooms'])->sum('count');
        $nightCount = Carbon::parse($data['booking_result']['check_in'])->diffInDays($data['booking_result']['check_out']);
        $booking_data = [
            'customer_id' => $data['customer_id'],
            'channel_id' => 122, //reception_id
            'number_of_rooms' => collect($data['booking_result']['typed_rooms'])->sum('count'),
            'number_of_adults' => $data['booking_result']['number_of_adults_total'],
            'number_of_children' => $data['booking_result']['number_of_children_total'],
            'calendar_colors' => json_encode($this->getRandomColors(), JSON_THROW_ON_ERROR),
        ];
        $booking = Booking::create($booking_data);
        $number_of_adults = $data['booking_result']['number_of_adults_total'] / $selected_room_count || $data['number_of_adults'];
        $number_of_children = $data['booking_result']['number_of_children_total'] / $selected_room_count || $data['number_of_children'];
        $children_ages = $number_of_children > 0 ? $data['children_ages'] : null;
        $discountRate = $data['discount_rate'];
        foreach ($data['checked_rooms'] as $type_has_view_id => $room) {
            foreach ($room as $room_id) {
                $bookingRoom = BookingRoom::create([
                    'booking_id' => $booking->id,
                    'room_id' => $room_id,
                    'check_in' => Carbon::createFromFormat('d.m.Y H:i:s', $data['booking_result']['check_in'] . ' '
                        . $this->settings->check_in_time_policy['value'] . ':00')
                        ->format('Y-m-d H:i:s'),
                    'check_out' => Carbon::createFromFormat('d.m.Y H:i:s', $data['booking_result']['check_out'] . ' '
                        . $this->settings->check_out_time_policy['value'] . ':00')->format('Y-m-d H:i:s'),
                    'number_of_adults' => $number_of_adults,
                    'number_of_children' => $number_of_children,
                    'children_ages' => json_encode($children_ages, JSON_THROW_ON_ERROR),
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now(),
                ]);
                $type_has_view = TypeHasView::find($type_has_view_id);
                $roomTypeHasViewName = $type_has_view->type->name . ' ' . $type_has_view->view->name;
                //vergi dahil indirimli tutar
                $documentItemDiscountedPriceTotal = collect($data['daily_prices'][$type_has_view_id][$room_id])->sum('price');
                //vergi dahil indirimsiz tutar
                $documentItemPrice = round($documentItemDiscountedPriceTotal / $discountRate);
                $documentItemTax = round($documentItemPrice - ($documentItemPrice / (1 +
                            (floatval($getSettingBookingTax->rate) /
                                100))), 2);
                $documentItemDiscount = $documentItemPrice - round($documentItemDiscountedPriceTotal);
                $document = $bookingRoom->documents()->create([
                    'type' => 'invoice',
                    'customer_id' => $data['customer_id'],
                    'number' => '',
                    'status' => $check_in_required ? 'received' : 'draft',
                    'currency' => $this->settings->currency['value'],
                    'currency_rate' => 1,
                    'issue_date' => Carbon::createFromFormat('d.m.Y', $data['booking_result']['check_in'])->format('Y-m-d'),
                    'due_date' => Carbon::createFromFormat('d.m.Y', $data['booking_result']['check_out'])->format('Y-m-d'),
                ]);
                $itemName = $roomTypeHasViewName . ' (' . $data['booking_result']['check_in'] . ' - '
                    . $data['booking_result']['check_out'] . ') ' . $nightCount . ' Gece ' . $number_of_adults . ' Yetişkin';
                if ($number_of_children > 0) {
                    $itemName .= ' ' . $number_of_children . ' Çocuk ';
                }
                $itemName .= 'Konaklama Bedeli.';
                $document->items()->create([
                    'item_id' => null,
                    'name' => $itemName,
                    'description' => '',
                    'price' => $documentItemPrice - $documentItemTax,
                    'quantity' => 1,
                    'tax_name' => $getSettingBookingTax->name,
                    'tax_rate' => $getSettingBookingTax->rate,
                    'tax' => $documentItemTax,
                    'total' => $documentItemPrice, //vergi dahil indirimsiz tutar
                    'discount' => $documentItemDiscount,
                    'grand_total' => $documentItemDiscountedPriceTotal,
                ]);
                $document->total()->create([
                    'type' => 'subtotal',
                    'sort_order' => 1,
                    'amount' => $documentItemPrice - $documentItemTax,
                ]);
                $document->total()->create([
                    'type' => 'tax',
                    'sort_order' => 2,
                    'amount' => $documentItemTax,
                ]);
                if ($documentItemDiscount > 0) {
                    $document->total()->create([
                        'type' => 'discount',
                        'sort_order' => 3,
                        'amount' => $documentItemDiscount,
                    ]);
                }
                $document->total()->create([
                    'type' => 'total',
                    'sort_order' => $documentItemDiscount > 0 ? 4 : 3,
                    'amount' => $documentItemDiscountedPriceTotal,
                ]);
                foreach ($data['daily_prices'][$type_has_view_id][$room_id] as $dailyPrice) {
                    if ($dailyPrice !== null) {
                        BookingDailyPrice::firstOrCreate([
                            'booking_room_id' => $bookingRoom->id,
                            'date' => $dailyPrice['date'],
                        ], [
                            'original_price' => round($dailyPrice['price'] / $discountRate),
                            'discount' => round($dailyPrice['price'] / $discountRate) - round($dailyPrice['price']),
                            'price' => round($dailyPrice['price']),
                            'currency' => $this->settings->currency['value'],
                        ]);
                    }
                }
            }
        }
        collect($data['rooms_guests'])->each(function ($room_ytpe, $key) use ($booking, $check_in_required) {
            collect($room_ytpe)->each(function ($guest, $key) use ($booking, $check_in_required) {
                foreach ($guest as $value) {
                    if ($value['name'] !== null && $value['surname'] !== null && $value['citizen_id'] !== null) {
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

    public function getAvailableRoomsAndPrices(BookingStepOneRequest $request): array
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
                'prices' => $priceCalculator->prices(
                    $typeHasViews->id,
                    $request->check_in,
                    $request->check_out,
                    $request->number_of_adults,
                    $request->number_of_children,
                    $request->children_ages
                ),
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

    /**
     * Display the specified resource.
     */
    public function show(Booking $booking): Response
    {
        $grandTotal = $booking->documents->map(fn($document) => $document->total->filter(fn($total) => $total->type === 'total')->map(fn($total) => $total->amount))->flatten(1)
            ->sum();
        $remainingBalance = round($grandTotal - $booking->documents->map(fn($document) => $document->payments->map(fn($payment) => $payment->amount))->flatten(1)->sum(), 2);
        $availableDatesCounts = [];
        return Inertia::render('Hotel/Booking/Show', [
            'currency' => $this->settings->currency['value'],
            'accommodation_type' => $this->settings->accommodation_type['value'],
            'citizens' => Citizen::select(['id', 'name'])->get(),
            'taxes' => Tax::select(['id', 'name', 'rate'])->get(),
            'items' => SalesUnit::find(1)->items->map(function ($item) {
                $price = !empty($item->prices->filter(fn($price) => !empty($price) && $price->sales_unit_channel_id === 1)) ?
                    $item->prices->filter(fn($price) => !empty($price) &&
                        $price->sales_unit_channel_id === 1)->map(function ($price) use ($item) {
                        return $item->price * (1 + ((float)$price->price_rate / 100));
                    })->first() : $item->price;
                return [
                    'id' => $item->id,
                    'item_category_id' => $item->item_category_id,
                    'item_category' => $item->category->name,
                    'name' => $item->name,
                    'description' => $item->description,
                    'type' => $item->type,
                    'price' => $price,
                    'price_formatted' => number_format($price, 2, ',', '.') . ' ' . $this->settings->currency['value'],
                    'tax_id' => $item->tax_id,
                    'tax_name' => $item->taxes->name,
                    'tax_rate' => floatval($item->taxes->rate),
                    'tax' => $item->tax,
                    'tax_formatted' => number_format($item->tax, 2, ',', '.') . ' ' . $this->settings->currency['value'],
                    'total_price' => $item->total_price,
                    'total_price_formatted' => number_format($item->total_price, 2, ',', '.') . ' ' . $this->settings->currency['value'],
                    'preparation_time' => $item->preparation_time,
                ];
            }),
            'booking' => [
                'id' => $booking->id,
                'booking_code' => $booking->booking_code,
                'channel' => $booking->channel->name,
                'check_in' => Carbon::parse($booking->rooms->pluck('check_in')->min())->format('d.m.Y'),
                'check_out' => Carbon::parse($booking->rooms->pluck('check_out')->max())->format('d.m.Y'),
                'number_of_rooms' => $booking->number_of_rooms,
                'number_of_adults' => $booking->number_of_adults,
                'number_of_children' => $booking->number_of_children,
                'stay_duration_days' => $booking->stayDurationDay(),
                'stay_duration_nights' => ((int)($booking->stayDurationNight()) + 1) . 'Gece',
                'rooms' => $booking->rooms->map(function ($booking_room) use (
                    $booking,
                    &$availableDatesCounts
                ) {
                    $availableDatesCount = 0;
                    $checkinDates = $booking_room->room->bookings->map(fn($booking) => $booking->check_in)->toArray();
                    for ($i = 1; $i < 15; $i++) {
                        $date = Carbon::parse($booking->check_out)->endOf('day');
                        $date->addDay($i);
                        $dateStr = $date->format('Y-m-d');
                        if (!in_array($dateStr, $checkinDates, true)) {
                            $availableDatesCount++;
                        } else {
                            break;
                        }
                    }
                    $availableDatesCounts[$booking_room->id] = $availableDatesCount;
                    $bookingGuests = BookingGuests::where('booking_room_id', $booking_room->id)->get();
                    return [
                        'booking_room_id' => $booking_room->id,
                        'id' => $booking_room->room->id,
                        'name' => $booking_room->room->name,
                        'room_type' => $booking_room->room->roomType->name,
                        'room_view' => $booking_room->room->roomView->name,
                        'room_type_full_name' => $booking_room->room->roomType->name . ' ' . $booking_room->room->roomView->name,
                        'check_in' => Carbon::parse($booking_room->check_in)->format('d.m.Y'),
                        'check_out' => Carbon::parse($booking_room->check_out)->format('d.m.Y'),
                        'number_of_adults' => $booking_room->number_of_adults,
                        'number_of_children' => $booking_room->number_of_children,
                        'children_ages' => $booking_room->children_ages !== null ? json_decode($booking_room->children_ages, false, 512, JSON_THROW_ON_ERROR) :
                            null,
                        'documents' => $booking_room->documents->map(fn($document) => [
                            'id' => $document->id,
                            'type' => $document->type,
                            'customer' => [
                                'id' => $document->customer->id,
                                'type' => $document->customer->type === 'individual' ? 'Bireysel' : 'Kurumsal',
                                'title' => $document->customer->title,
                                'tax_office' => $document->customer->tax_office,
                                'tax_number' => $document->customer->tax_number,
                                'email' => $document->customer->email,
                                'phone' => $document->customer->phone,
                                'country' => $document->customer->country,
                                'city' => $document->customer->city,
                                'address' => $document->customer->address
                            ],
                            'number' => $document->number,
                            'status' => $document->status,
                            'currency' => $document->currency,
                            'currency_rate' => $document->currency_rate,
                            'issue_date' => Carbon::parse($document->issue_date)->format('d.m.Y'),
                            'due_date' => Carbon::parse($document->due_date)->format('d.m.Y'),
                            'items' => $document->items->map(fn($item) => [
                                'name' => $item->name,
                                'description' => $item->description,
                                'price' => $item->price,
                                'price_formatted' => number_format($item->price, 2, ',', '.') . ' ' .
                                    $document->currency,
                                'quantity' => $item->quantity,
                                'tax_name' => $item->tax_name,
                                'tax_rate' => $item->tax_rate,
                                'tax' => $item->tax,
                                'tax_formatted' => number_format($item->tax, 2, ',', '.') . ' ' .
                                    $document->currency,
                                'total' => $item->total,
                                'total_formatted' => number_format($item->total, 2, ',', '.') . ' ' .
                                    $document->currency,
                                'discount' => $item->discount,
                                'discount_formatted' => number_format($item->discount, 2, ',', '.') . ' ' .
                                    $document->currency,
                                'grand_total' => $item->grand_total,
                                'grand_total_formatted' => number_format($item->grand_total, 2, ',', '.') . ' ' .
                                    $document->currency,
                            ]),
                            'totals' => $document->total->map(fn($total) => [
                                'type' => $total->type,
                                'amount' => $total->amount,
                                'amount_formatted' => number_format($total->amount, 2, ',', '.') . ' ' .
                                    $document->currency,
                                'sort_order' => $total->sort_order,
                            ]),
                            'payments' => $document->payments->map(fn($payment) => [
                                'id' => $payment->id,
                                'transaction_id' => $payment->transaction_id,
                                'paid_at' => Carbon::parse($payment->transaction->paid_at)->format('d.m.Y H:i:s'),
                                'amount' => $payment->amount,
                                'amount_formatted' => number_format($payment->amount, 2, ',', '.') . ' ' .
                                    $document->currency,
                            ]),
                            'balance' => round($document->total->filter(fn($total) => $total->type === 'total')->map(fn($total) => $total->amount)->first() - $document->payments->map(fn($payment) => $payment->amount)->sum(), 2),
                            'balance_formatted' => number_format(round($document->total->filter(fn($total) => $total->type === 'total')->map(fn($total) => $total->amount)->first() - $document->payments->map(fn($payment) => $payment->amount)->sum(), 2), 2, ',', '.') . ' ' . $document->currency,
                        ]),
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
                            'can_be_check_in' => !$booking_guest->check_in && Carbon::now()->isBetween(Carbon::parse
                                ($booking_room->check_in),
                                    Carbon::parse($booking_room->check_out)),
                            'can_be_check_out' => $booking_guest->check_in && !$booking_guest->check_out &&
                                Carbon::now()->isBetween(Carbon::parse
                                ($booking_room->check_in),
                                    Carbon::parse($booking_room->check_out)),
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
                        'extendable_number_of_days' => $availableDatesCount,
                    ];
                }),
            ],
            'customer' => [
                'id' => $booking->customer->id,
                'title' => $booking->customer->title,
                'type' => $booking->customer->type === 'individual' ? 'Bireysel' : 'Kurumsal',
                'tax_office' => $booking->customer->tax_office,
                'tax_number' => $booking->customer->tax_number,
                'country' => $booking->customer->country,
                'city' => $booking->customer->city,
                'address' => $booking->customer->address,
                'phone' => $booking->customer->phone,
                'email' => $booking->customer->email,
            ],
            'booking_payments' => $booking->documents->map(fn($document) => $document->payments->map(fn($payment) => [
                'id' => $payment->transaction->id,
                'customer_id' => $payment->transaction->customer_id,
                'type' => $payment->transaction->type,
                'bank' => [
                    'id' => $payment->transaction->bank->id,
                    'name' => $payment->transaction->bank->name,
                    'currency' => $payment->transaction->bank->currency,
                ],
                'paid_at' => Carbon::parse($payment->transaction->paid_at)->format('d.m.Y H:i:s'),
                'description' => $payment->transaction->description,
                'amount' => $payment->transaction->amount,
                'amount_formatted' => number_format($payment->transaction->amount, 2, '.', ',') . ' ' . $payment->transaction->currency,
                'currency' => $payment->transaction->currency,
                'currency_rate' => $payment->transaction->currency_rate,
                'payment_method' => $payment->transaction->payment_method,
            ]))->flatten(1),
            'banks' => Bank::select(['id', 'name'])->get(),
            'remaining_balance' => $remainingBalance,
            'remaining_balance_formatted' => number_format($remainingBalance, 2, '.', ',') . ' ' . $this->settings->currency['value'],
            'extendable_number_of_days' => collect($availableDatesCounts)->min(),
            'booking_messages' => $booking->notes,
        ]);
    }

    public function transactionAdd(StoreTransactionRequest $request, Booking $booking): \Illuminate\Http\RedirectResponse
    {
        $request->validated();
        $now = Carbon::now();
        $nowParseTime = Carbon::parse($now)->format('H:i:s');
        $transaction = Transaction::create([
            'customer_id' => $request->customer_id,
            'type' => $request->type,
            'bank_id' => $request->bank_id,
            'paid_at' => Carbon::parse($request->payment_date . ' ' . $nowParseTime)->format('Y-m-d H:i:s'),
            'description' => $request->description,
            'amount' => $request->amount,
            'currency' => $request->currency,
            'currency_rate' => $request->currency_rate,
            'payment_method' => $request->payment_method,
        ]);
        $amount = $request->amount;
        if ($request->document_id) {
            $document = Document::find($request->document_id);
            if ($document->currency !== $request->currency) {
                $rate = $document->currency_rate / $request->currency_rate;
                $dcTotal = $document->total->filter(function ($total) {
                        return $total->type === 'total';
                    })->first()->amount - $document->payments->sum('amount');
                $exchange = $dcTotal * $rate;
                $diff = $exchange - $amount;
                $document->payments()->create([
                    'transaction_id' => $transaction->id,
                    'amount' => $amount / $rate,
                ]);
            } else {
                $document->payments()->create([
                    'transaction_id' => $transaction->id,
                    'amount' => $amount,
                ]);
            }
            return redirect()->route('hotel.bookings.show', $booking)->with('success', 'Ödeme başarıyla eklendi.');
        } else {
            $booking->documents->each(function ($document) use ($request, $transaction, &$amount) {
                if ($amount > 0) {
                    if ($document->currency !== $request->currency) {
                        $rate = $document->currency_rate / $request->currency_rate;
                        $dcTotal = $document->total->filter(function ($total) {
                                return $total->type === 'total';
                            })->first()->amount - $document->payments->sum('amount');
                        $exchange = $dcTotal * $rate;
                        $diff = $exchange - $amount;
                        if ($diff < 0) {
                            $document->payments()->create([
                                'transaction_id' => $transaction->id,
                                'amount' => $dcTotal,
                            ]);
                            $amount = round(abs($diff), 2);
                            return true;
                        } else {
                            $document->payments()->create([
                                'transaction_id' => $transaction->id,
                                'amount' => $amount / $rate,
                            ]);
                            $amount = 0;
                            return false;
                        }
                    } else {
                        $dcTotal = $document->total->filter(function ($total) {
                                return $total->type === 'total';
                            })->first()->amount - $document->payments->sum('amount');
                        $diff = $dcTotal - $amount;
                        if ($diff < 0) {
                            $document->payments()->create([
                                'transaction_id' => $transaction->id,
                                'amount' => $dcTotal,
                            ]);
                            $amount = abs($diff);
                            return true;
                        } else {
                            $document->payments()->create([
                                'transaction_id' => $transaction->id,
                                'amount' => $amount,
                            ]);
                            $amount = 0;
                            return false;
                        }
                    }
                } else {
                    return false;
                }
            });
        }
        return redirect()->route('hotel.bookings.show', $booking)->with('success', 'Ödeme başarıyla eklendi.');
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

    /**
     * @return array
     * @throws RandomException
     */
    protected function getRandomColors(): array
    {
        $maxBrightness = 200;  // Minimum brightness for background color
        $minTextColorDiff = 150;  // Minimum difference in brightness for text color
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
