<?php

namespace App\Http\Controllers\Hotel;

use App\Http\Controllers\Controller;
use App\Models\BookingRooms;
use App\Http\Requests\StoreBookingRoomsRequest;
use App\Http\Requests\UpdateBookingRoomsRequest;

class BookingRoomsController extends Controller
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
