<?php

namespace App\Http\Controllers\Hotel;

use App\Http\Controllers\Controller;
use App\Http\Requests\BookingRoomsAddGuestsRequest;
use App\Http\Requests\StoreBookingRoomsRequest;
use App\Http\Requests\UpdateBookingRoomsRequest;
use App\Models\BookingGuests;
use App\Models\BookingRoom;
use App\Models\BookingTotalPrice;
use App\Models\Citizen;
use App\Models\Guest;
use App\Models\Task;
use App\Settings\PricingPolicySettings;
use Carbon\Carbon;

class BookingRoomsController extends Controller
{

    protected PricingPolicySettings $settings;

    public function __construct()
    {
        $this->settings = new PricingPolicySettings();
    }

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
        return redirect()->back()->with('success', 'Guests added successfully');
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
