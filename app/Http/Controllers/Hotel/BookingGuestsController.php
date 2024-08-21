<?php

namespace App\Http\Controllers\Hotel;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateBookingGuestsCheckInOutRequest;
use App\Models\BookingGuests;
use App\Http\Requests\StoreBookingGuestsRequest;
use App\Http\Requests\UpdateBookingGuestsRequest;
use App\Models\Guest;
use Carbon\Carbon;

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
        $data = $request->validated();
        foreach ($data['guests'] as $guest) {
            $guest = Guest::create([
                'name' => $guest['name'],
                'surname' => $guest['surname'],
                'birthday' => Carbon::parse($guest['birthday'])->format('Y-m-d'),
                'is_foreign_nationnal' => $guest['citizen_id'] !== 1001 ? 1 : 0,
                'citizen_id' => $guest['citizen_id'],
                'identification_number' => $guest['identification_number'],
            ]);
            $booking_guest = BookingGuests::create([
                'booking_room_id' => $data['booking_room_id'],
                'guest_id' => $guest->id,
            ]);
        }
        return redirect()->back()->with('error', 'Guests could not be added');
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
        foreach ($request->booking_guests as $bookingGuestId) {
            $bookingGuest = BookingGuests::find($bookingGuestId);
            $bookingGuest->status = 'check_in';
            $bookingGuest->check_in = true;
            $bookingGuest->check_in_date = Carbon::now()->format('Y-m-d');
            if ($bookingGuest->isDirty(['status', 'check_in', 'check_in_date']) && $bookingGuest->getOriginal('status')
                === 'pending') {
                $bookingGuest->update($bookingGuest->getDirty());
            }
            $bookingGuest->update([
                'status' => 'check_in',
                'check_in' => true,
                'check_in_date' => Carbon::now()->format('Y-m-d H:i:s'),
            ]);
        }
        return redirect()->back()->with('success', 'Guests checked in successfully');
    }

    public function checkOut(UpdateBookingGuestsCheckInOutRequest $request)
    {
        $request->validated();
        foreach ($request->booking_guests as $bookingGuestId) {
            $bookingGuest = BookingGuests::find($bookingGuestId);
            $bookingGuest->update([
                'status' => 'check_out',
                'check_out' => true,
                'check_out_date' => Carbon::now()->format('Y-m-d H:i:s'),
            ]);
        }
        return redirect()->back()->with('success', 'Guests checked out successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(BookingGuests $bookingGuest)
    {
        $bookingGuest->delete();
        return redirect()->back()->with('success', 'Guest deleted successfully');
    }
}
