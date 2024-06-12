<?php

namespace App\Http\Controllers\Hotel;

use App\Http\Controllers\Controller;
use App\Models\CMBooking;
use Illuminate\Http\Request;

class CMBookingController extends Controller
{
    public function index()
    {
        return CMBooking::all();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'code' => ['required'],
            'booking_id' => ['required', 'integer'],
        ]);

        return CMBooking::create($data);
    }

    public function show(CMBooking $cMBooking)
    {
        return $cMBooking;
    }

    public function update(Request $request, CMBooking $cMBooking)
    {
        $data = $request->validate([
            'code' => ['required'],
            'booking_id' => ['required', 'integer'],
        ]);

        $cMBooking->update($data);

        return $cMBooking;
    }

    public function destroy(CMBooking $cMBooking)
    {
        $cMBooking->delete();

        return response()->json();
    }
}
