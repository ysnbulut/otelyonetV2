<?php

namespace App\Http\Controllers\Hotel;

use App\Http\Controllers\Controller;
use App\Models\BookingPayment;
use App\Http\Requests\StoreCustomerPaymentsRequest;
use App\Http\Requests\UpdateCustomerPaymentsRequest;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class BookingPaymentsController extends Controller
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
    public function store(StoreCustomerPaymentsRequest $request)
    {
	    BookingPayment::create($request->validated());
			if($request->has('booking_id')) {
				return Inertia::render('Hotel/Booking/Show', [
          'booking' => $request->booking_id,
          'success' => 'Rezervasyon ödeme tahsilatı başarılı.'
        ]);
			} else {
				return Redirect::back()->with('success', 'Ödeme tahsilatı başarılı.');
			}

    }

    /**
     * Display the specified resource.
     */
    public function show(BookingPayment $customerPayments)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(BookingPayment $customerPayments)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCustomerPaymentsRequest $request, BookingPayment $customerPayments)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(BookingPayment $customerPayments)
    {
        //
    }
}
