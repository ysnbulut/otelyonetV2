<?php

namespace App\Http\Controllers;

use App\Http\Requests\BookingCreateStepFiveStoreRequest;
use App\Http\Requests\BookingCreateStepFourStoreRequest;
use App\Http\Requests\BookingCreateStepThreeRequest;
use App\Http\Requests\BookingCreateStepThreeStoreRequest;
use App\Http\Requests\BookingCreateStepTwoRequest;
use App\Models\Booking;
use App\Models\CaseAndBanks;
use App\Models\Customer;
use App\Models\CustomerPayments;
use App\Models\Guest;
use App\Models\Room;
use App\Models\TypeHasView;
use App\Settings\GeneralSettings;
use Carbon\Carbon;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Str;
use Inertia\Inertia;

class BookingController extends Controller
{
	/**
	 * Display a listing of the resource.
	 */
	public function index()
	{
		$settings = new GeneralSettings();
		return [
			'currency' => $settings->currency,
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
		];
	}

    public function upcoming() {
        $settings = new GeneralSettings();
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
                'amount_formatted' => $booking->amount ? number_format($booking->amount->grand_total, 2, '.', ',') . ' ' . $settings->currency : null,
                'remaining_balance' => $booking->amount ? $booking->remainingBalance() : null,
                'remaining_balance_formatted' => $booking->amount ? number_format($booking->remainingBalance(), 2, '.', ',') . ' ' . $settings->currency : null,
            ]);
    }

	public function calendar(): View|\Illuminate\Foundation\Application|Factory|Application
	{
		$settings = new GeneralSettings();
		$bookings = Booking::orderBy('id')
			->with('rooms')
			->where(column: 'check_out', operator: '>=', value: Carbon::now()->format('Y-m-d'))
			->orWhereNull('check_out')
			->get();
		$check_in_time = Str::of($settings->checkin_policy['check_in_time'])->explode(':');
		$check_out_time = Str::of($settings->checkin_policy['check_out_time'])->explode(':');
	 	return view('hotel.pages.bookings.calendar', data: [
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
			'bookings' => $bookings->flatMap(callback: function ($booking) use ($settings) {
				return $booking->rooms->map(function ($room) use ($booking, $settings) {
					$randomColors = $this->getRandomColors();
					return [
						'id' => $booking->id,
						'resourceId' => $room->id,
						'title' => Carbon::createFromFormat('Y-m-d', $booking->check_in)->format('d.m.Y') . ' ' . $booking->check_out . ' ' . $booking->stayDurationNight(),
						'start' => $booking->check_in . ' ' . $settings->checkin_policy['check_in_time'],
						'end' => $booking->check_out != null ? $booking->check_out . ' ' . $settings->checkin_policy['check_out_time'] : Carbon::now()->addDays(10)->format('Y-m-d') . ' '. $settings->checkin_policy['check_out_time'],
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

	/**
	 * @return View|\Illuminate\Foundation\Application|Factory|Application
	 */
	public function create(): View|\Illuminate\Foundation\Application|Factory|Application
	{
		return view('hotel.pages.bookings.create');
	}

	public function createSingleStepOne(BookingCreateStepTwoRequest $request): View|\Illuminate\Foundation\Application|Factory|Application
	{
		$unavailableRoomsIds = Booking::getUnavailableRoomsIds($request->check_in, $request->check_out);
		$roomResults = TypeHasView::with([
			'view',
			'rooms' => function ($query) use ($unavailableRoomsIds) {
				$query->whereNotIn('id', $unavailableRoomsIds);
			},
		])
			->has('rooms')
			->whereHas('type', function ($query) use ($request) {
				$query->with(['beds', 'features'])->where('adult_capacity', '>=', $request->number_of_adults)->where('child_capacity', '>=', $request->number_of_children); // + $request->number_of_children  Burada çocuk yaşını config e göre kontrol edicen
			})
			->get()
			->map(function ($typeHasViews) use ($request) {
				return [
					'id' => $typeHasViews->id,
					'name' => $typeHasViews->type->name . ' ' . $typeHasViews->view->name,
					'size' => $typeHasViews->type->size,
					'room_count' => $typeHasViews->type->room_count,
					'adult_capacity' => $typeHasViews->type->adult_capacity,
					'child_capacity' => $typeHasViews->type->child_capacity,
					'beds' => $typeHasViews->type->beds->map(
						fn($bed) => [
							'name' => $bed->name,
							'person_num' => $bed->person_num,
						]
					),
					'features' => $typeHasViews->type->features->map(fn($feature) => $feature->name),
					'rooms' => $typeHasViews->rooms->count() > 0 ? $typeHasViews->rooms->map(
						fn($room) => [
							'id' => $room->id,
							'name' => $room->name,
						]
					) : false,
					'price' => $typeHasViews
						->singlePriceCalculator(
							$typeHasViews->id,
							$request->check_in,
							$request->check_out,
							$request->number_of_adults,
							$request->number_of_children
						//$request->children_ages
						)
						->first(),
				];
			});

		$settings = new GeneralSettings();
		return view('hotel.pages.bookings.create-single-step-one', [
			'currency' => $settings->currency,
			'check_in' => $request->check_in,
			'check_out' => $request->check_out,
			'open_booking' => $request->open_booking,
			'number_of_adults' => $request->number_of_adults,
			'number_of_children' => $request->number_of_children,
			'children_ages' => $request->children_ages,
			'roomResults' => $roomResults,
		]);
	}

	public function createGroupStepOne(BookingCreateStepTwoRequest $request)
	{
		$settings = new GeneralSettings();
		$unavailableRoomsIds = Booking::getUnavailableRoomsIds($request->check_in, $request->check_out);
		$roomResults = TypeHasView::with([
			'view',
			'rooms' => function ($query) use ($unavailableRoomsIds) {
				$query->whereNotIn('id', $unavailableRoomsIds);
			},
		])
			->has('rooms')
			->whereHas('type', function ($query) use ($request) {
				$query->with(['beds', 'features']);
			})
			->get()
			->map(function ($typeHasViews) use ($request) {
				return [
					'id' => $typeHasViews->id,
					'name' => $typeHasViews->type->name . ' ' . $typeHasViews->view->name,
					'size' => $typeHasViews->type->size,
					'room_count' => $typeHasViews->type->room_count,
					'available_room_count' => $typeHasViews->rooms->count(),
					'adult_capacity' => $typeHasViews->type->adult_capacity,
					'child_capacity' => $typeHasViews->type->child_capacity,
					'beds' => $typeHasViews->type->beds->map(
						fn($bed) => [
							'name' => $bed->name,
							'person_num' => $bed->person_num,
						]
					),
					'features' => $typeHasViews->type->features->map(fn($feature) => $feature->name),
					'rooms' => $typeHasViews->rooms->count() > 0 ? $typeHasViews->rooms->map(
						fn($room) => [
							'id' => $room->id,
							'name' => $room->name,
						]
					) : false,
					'price' => $typeHasViews
						->groupPriceCalculator(
							$typeHasViews->id,
							$request->check_in,
							$request->check_out,
							$request->number_of_adults,
							$request->number_of_children
						//$request->children_ages
						),
				];
			});
		return view('hotel.pages.bookings.create-group-step-one', [
			'currency' => $settings->currency,
			'roomResults' => $roomResults,
		]);
	}
	public function createStepTwoCreate(BookingCreateStepThreeRequest $request): View|\Illuminate\Foundation\Application|Factory|Application
	{
		dd($request->all());
		$settings = new GeneralSettings();
		$room = Room::find($request->session()->get('room'));
		return view('hotel.pages.bookings.create-step-three', [
			'currency' => $settings->currency,
			'booking' => [
				'check_in' => $request->check_in,
				'check_out' => $request->check_out,
				'open_booking' => $request->open_booking,
				'number_of_adults' => $request->number_of_adults,
				'number_of_children' => $request->number_of_children,
				'children_ages' => $request->children_ages,
			],
			'room' => [
				'number' => $room->name,
				'name' => $room->roomType->name . ' ' . $room->roomView->name,
			],
			'price' => $request->session()->get('price'),
			'tax_rate' => $settings->tax_rate,
		]);
	}

	public function createStepThreeStore(BookingCreateStepThreeStoreRequest $request): \Illuminate\Http\RedirectResponse
	{
		$request->validated();
		if (!$request->new_customer) {
			$customer = Customer::find($request->customer_id);
		} else {
			$customer = Customer::create([
				'title' => $request->customer_name,
				'type' => $request->type,
				'tax_number' => $request->tax_number,
				'country' => $request->country,
				'city' => $request->city,
				'address' => $request->address,
				'phone' => $request->phone,
				'email' => $request->email,
			]);
		}
		$booking = Booking::create([
			'customer_id' => $customer->id,
			'check_in' => $request->check_in,
			'check_out' => $request->open_booking === 'true' ? null : $request->check_out,
		]);
		$booking->amount()->create([
			'price' => $request->price,
			'campaign' => $request->campaign,
			'discount' => $request->discount,
			'total_price' => $request->total_price,
			'tax' => $request->tax,
			'grand_total' => $request->grand_total,
		]);
		$booking->rooms()->attach($request->room_id, [
			'number_of_adults' => $request->number_of_adults,
			'number_of_children' => $request->number_of_children,
		]);
		$request->session()->put('booking', $booking->id);
		$request->session()->put('customer', $customer->id);
		$request
			->session()
			->forget([
				'check_in',
				'check_out',
				'open_booking',
				'number_of_adults',
				'number_of_children',
				'children_ages',
				'price',
				'room',
			]);
		return redirect()->route('hotel.bookings.create.step.four.create');
	}

	public function createStepFourCreate()
	{
		if (!Session::has('booking')) {
			return redirect()
				->route('hotel.bookings.create.step.one')
				->withErrors(['booking' => 'Rezervasyon oluştrulmadan ilerleyemezsiniz.']);
		} else {
			return view('hotel.pages.bookings.create-step-four');
		}
	}

	public function createStepFourStore(BookingCreateStepFourStoreRequest $request)
	{
		$booking = Booking::find($request->session()->get('booking'));
		foreach ($request->guests as $guest) {
			$guest = Guest::create([
				'name' => $guest['name'],
				'surname' => $guest['surname'],
				'nationality' => $guest['nationality'],
				'identification_number' => $guest['identification_number'],
				'phone' => $guest['phone'],
				'email' => $guest['email'],
				'gender' => $guest['gender'],
			]);
			$booking->guests()->attach($guest);
		}
		return redirect()->route('hotel.bookings.create.step.five.create');
	}

	public function createStepFiveCreate()
	{
		$settings = new GeneralSettings();
		if (!Session::has('booking')) {
			return redirect()
				->route('hotel.bookings.create.step.one')
				->withErrors(['booking' => 'Rezervasyon oluştrulmadan ilerleyemezsiniz.']);
		} else {
			$booking = Booking::find(Session::get('booking'));
			return view(
				'hotel.pages.bookings.create-step-five',
				data: [
					'currency' => $settings->currency,
					'booking' => [
						'booking_id' => $booking->id,
						'check_in' => Carbon::createFromFormat('Y-m-d', $booking->check_in)->format('d.m.Y'),
						'check_out' =>
							$booking->check_out === null ? null : Carbon::createFromFormat('Y-m-d', $booking->check_out)->format('d.m.Y'),
						'number_of_adults' => $booking->rooms->sum('pivot.number_of_adults'),
						'number_of_children' => $booking->rooms->sum('pivot.number_of_children'),
						'open_booking' => $booking->check_out === null,
						'stay_duration_day' => $booking->scopeStayDurationDay(),
						'stay_duration_night' => $booking->scopeStayDurationNight(),
						//'children_ages' => $booking->children_ages,
						'rooms' => $booking->rooms->map(
							fn($room) => [
								'id' => $room->id,
								'number' => $room->name,
								'name' => $room->roomType->name . ' ' . $room->roomView->name,
								'type' => $room->roomType->name,
								'view' => $room->roomView->name,
								'number_of_adults' => $room->pivot->number_of_adults,
								'number_of_children' => $room->pivot->number_of_children,
								'features' => $room->roomType->features->pluck('name'),
								'beds' => $room->roomType->beds->map(
									fn($bed) => [
										'id' => $bed->id,
										'name' => $bed->name,
										'count' => $bed->pivot->count,
									]
								),
							]
						),
						'customer' => [
							'id' => $booking->customer->id,
							'title' => $booking->customer->title,
							'type' => $booking->customer->type,
							'tax_number' => $booking->customer->tax_number,
							'country' => $booking->customer->country,
							'city' => $booking->customer->city,
							'address' => $booking->customer->address,
							'phone' => $booking->customer->phone,
							'email' => $booking->customer->email,
						],
						'guests' => $booking->guests->map(
							fn($guest) => [
								'id' => $guest->id,
								'name' => $guest->name,
								'surname' => $guest->surname,
								'nationality' => $guest->nationality,
								'identification_number' => $guest->identification_number,
								'phone' => $guest->phone,
								'email' => $guest->email,
								'gender' => $guest->gender,
							]
						),
						'amount' => [
							'id' => $booking->amount->id,
							'currency' => $booking->amount->currency,
							'price' => $booking->amount->price,
							'price_formatted' => number_format($booking->amount->price, 2, '.', ',') . ' ' . $settings->currency,
							'campaign' => $booking->amount->campaign,
							'discount' => $booking->amount->discount,
							'discount_formatted' => number_format($booking->amount->discount, 2, '.', ',') . ' ' . $settings->currency,
							'total_price' => $booking->amount->total_price,
							'total_price_formatted' => number_format($booking->amount->total_price, 2, '.', ',') . ' ' . $settings->currency,
							'tax_rate' => $settings->tax_rate,
							'tax' => $booking->amount->tax,
							'tax_formatted' => number_format($booking->amount->tax, 2, '.', ',') . ' ' . $settings->currency,
							'grand_total' => $booking->amount->grand_total,
							'grand_total_formatted' => number_format($booking->amount->grand_total, 2, '.', ',') . ' ' . $settings->currency,
						],
					],
					'case_and_banks' => CaseAndBanks::select(['id', 'name'])->get(),
				]
			);
		}
	}

	public function createStepFiveStore(BookingCreateStepFiveStoreRequest $request)
	{
		$request->validated();
		CustomerPayments::create([
			'customer_id' => $request->session()->get('customer'),
			'booking_id' => $request->session()->get('booking'),
			'payment_date' => Carbon::parse($request->payment_date)->format('Y-m-d'),
			'case_and_banks_id' => $request->case_and_bank_id,
			'currency' => $request->currency,
			'currency_amount' => $request->currency_amount,
			'amount_paid' => $request->amount_paid,
			'payment_method' => $request->payment_method,
			'description' => 'Rezervasyon Ödemesi.',
		]);
		$request
			->session()
			->forget([
				'booking',
				'customer',
			]);
		return redirect()->route('hotel.bookings.index')->with('success', 'Rezervasyon başarıyla oluşturuldu.');
	}

	/**
	 * Store a newly created resource in storage.
	 */
	public function store()
	{
		return Request::all();
	}

	/**
	 * Display the specified resource.
	 */
	public function show(Booking $booking)
	{
		$settings = new GeneralSettings();
		return view('hotel.pages.bookings.show', data: [
			'currency' => $settings->currency,
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
					'number_of_adults' => $room->pivot->number_of_adults,
					'number_of_children' => $room->pivot->number_of_children,
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
					'amount_paid_formatted' => number_format($payment->amount_paid, 2, '.', ',') . ' ' . $settings->currency,
					'payment_method' => $payment->payment_method,
					'description' => $payment->description,
				]
			),
			'guests' => $booking->guests->map(fn($guest) => [
				'id' => $guest->id,
				'name' => $guest->name,
				'surname' => $guest->surname,
			]),
			'amount' => [
				'id' => $booking->amount->id,
				'price' => $booking->amount->price,
				'price_formatted' => number_format($booking->amount->price, 2, '.', ',') . ' ' . $settings->currency,
				'campaign' => $booking->amount->campaign,
				'discount' => $booking->amount->discount,
				'discount_formatted' => number_format($booking->amount->discount, 2, '.', ',') . ' ' . $settings->currency,
				'total_price' => $booking->amount->total_price,
				'total_price_formatted' => number_format($booking->amount->total_price, 2, '.', ',') . ' ' . $settings->currency,
				'tax_rate' => $settings->tax_rate,
				'tax' => $booking->amount->tax,
				'tax_formatted' => number_format($booking->amount->tax, 2, '.', ',') . ' ' . $settings->currency,
				'grand_total' => $booking->amount->grand_total,
				'grand_total_formatted' => number_format($booking->amount->grand_total, 2, '.', ',') . ' ' . $settings->currency,
			],
			'case_and_banks' => CaseAndBanks::select(['id', 'name'])->get(),
			'remaining_balance' => round($booking->remainingBalance(), 2),
			'remaining_balance_formatted' => number_format($booking->remainingBalance(), 2, '.', ',') . ' ' . $settings->currency
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
		//
	}
}
