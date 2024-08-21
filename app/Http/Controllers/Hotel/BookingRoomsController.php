<?php

namespace App\Http\Controllers\Hotel;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBookingRoomsRequest;
use App\Http\Requests\UpdateBookingRoomsRequest;
use App\Models\BookingRoom;
use App\Models\BookingTotalPrice;
use App\Settings\PricingPolicySettings;

class BookingRoomsController extends Controller
{

    protected PricingPolicySettings $settings;

    public function __construct()
    {
        $this->settings = new PricingPolicySettings();
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
    public function show(BookingRoom $bookingRooms)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(BookingRoom $bookingRooms)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBookingRoomsRequest $request, BookingRoom $bookingRoom)
    {
        return $bookingRoom->update($request->validated()) ?
            response()->json(['status' => 'success', 'message' => 'Booking room updated successfully']) : response()->json(['status' => 'error', 'message' => 'Booking room could not be updated']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($booking_room_id)
    {
        //TODO: Burası komple revize
        //TODO: Fiyat iade vs varsa kontrol edilecek
        $bookingRoom = BookingRoom::find($booking_room_id);
        $bookingRoom->booking_guests()->delete();
        $deletedPrice = 0;
        $deletedDiscount = 0;
        $bookingRoom->prices->each(function ($price) use ($bookingRoom, &$deletedPrice, &$deletedDiscount) {
            $deletedPrice += $price->price;
            $deletedDiscount += $price->discount;
        });
        $booking = $bookingRoom->booking;
        $newTotalPrice = $booking->total_price->total_price - $deletedPrice;
        $newTax = round($newTotalPrice - ($newTotalPrice / (1 +
                    ($this->settings->tax_rate['value'] /
                        100))), 2);
        $booking->total_price()->update([
            'discount' => $booking->total_price->discount - $deletedDiscount,
            'total_price' => $newTotalPrice,
            'tax' => $newTax,
            'grand_total' => $newTotalPrice + $newTax,
        ]);
        $bookingRoom->prices()->delete();
        $bookingRoom->tasks()->delete();
        $bookingRoom->expenses()->delete();
        $bookingRoom->delete();
        return [
            'status' => 'success',
            'message' => 'Booking room deleted successfully',
            'total_price' => round($deletedPrice + ($booking->total_price->tax - $newTax))
        ];
    }
}
