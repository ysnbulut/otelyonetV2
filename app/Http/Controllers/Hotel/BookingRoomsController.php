<?php

namespace App\Http\Controllers\Hotel;

use App\Http\Controllers\Controller;
use App\Http\Requests\BookingRoomsAddGuestsRequest;
use App\Http\Requests\StoreBookingRoomsRequest;
use App\Http\Requests\UpdateBookingRoomsRequest;
use App\Models\BookingGuests;
use App\Models\BookingRooms;
use App\Models\Citizen;
use App\Models\Guest;
use Carbon\Carbon;

class BookingRoomsController extends Controller
{

    public function addGuests(BookingRoomsAddGuestsRequest $request)
    {

        $data = $request->validated();
        $returnData = [];
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
            $returnData[] = [
                'booking_guests_id' => $booking_guest->id,
                'id' => $guest->id,
                'name' => $guest->name,
                'surname' => $guest->surname,
                'birthday' => $guest->birthday,
                'gender' => $guest->gender,
                'citizen' => Citizen::find($guest->citizen_id)->name,
                'citizen_id' => $guest->citizen_id,
                'identification_number' => $guest->identification_number,
                'is_check_in' => 0,
                'is_check_out' => 0,
                'status' => 1,
                'check_in_date' => null,
                'check_out_date' => null,
                'check_in_kbs' => 0,
                'check_out_kbs' => 0,
            ];
        }
        return response()->json($returnData);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBookingRoomsRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(BookingRooms $bookingRooms)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(BookingRooms $bookingRooms)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBookingRoomsRequest $request, BookingRooms $bookingRooms)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($booking_room_id)
    {
        $bookingRoom = BookingRooms::find($booking_room_id);
        $bookingRoom->booking_guests()->forceDelete();
        $bookingRoom->expenses()->delete();
        $bookingRoom->forceDelete();
    }
}
