<?php

namespace App\Http\Controllers\Hotel;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateBookingGuestsCheckInOutRequest;
use App\Models\BookingGuests;
use App\Http\Requests\StoreBookingGuestsRequest;
use App\Http\Requests\UpdateBookingGuestsRequest;
use Carbon\Carbon;
use Illuminate\Support\Facades\Request;

class BookingGuestsController extends Controller
{
	/**
	 * Display a listing of the resource.
	 */
	public function index()
	{
		//
	}

	/**
	 * Show the form for creating a new resource.
	 */
	public function create()
	{
		//
	}

	/**
	 * Store a newly created resource in storage.
	 */
	public function store(StoreBookingGuestsRequest $request)
	{
		//
	}

	/**
	 * Display the specified resource.
	 */
	public function show(BookingGuests $bookingGuests)
	{
		//
	}

	/**
	 * Show the form for editing the specified resource.
	 */
	public function edit(BookingGuests $bookingGuests)
	{
		//
	}

	/**
	 * Update the specified resource in storage.
	 */
	public function update(UpdateBookingGuestsRequest $request, BookingGuests $bookingGuests)
	{
		//
	}

    public function checkIn(UpdateBookingGuestsCheckInOutRequest $request)
    {
        $request->validated();
        foreach ($request->booking_guests as $bookingGuestId) {
            $bookingGuest = BookingGuests::find($bookingGuestId);
            $bookingGuest->update([
                'status' => 'check_in',
                'check_in' => true,
                'check_in_date' => Carbon::now()->format('Y-m-d'),
            ]);
        }
    }

    public function checkOut(UpdateBookingGuestsCheckInOutRequest $request)
    {
        $request->validated();
        foreach ($request->booking_guests as $bookingGuestId) {
            $bookingGuest = BookingGuests::find($bookingGuestId);
            $bookingGuest->update([
                'status' => 'check_out',
                'check_out' => true,
                'check_out_date' => Carbon::now()->format('Y-m-d'),
            ]);
        }
    }
	/**
	 * Remove the specified resource from storage.
	 */
	public function destroy(BookingGuests $bookingGuests)
	{
		//
	}
}
