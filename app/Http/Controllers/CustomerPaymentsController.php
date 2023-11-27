<?php

namespace App\Http\Controllers;

use App\Models\CustomerPayments;
use App\Http\Requests\StoreCustomerPaymentsRequest;
use App\Http\Requests\UpdateCustomerPaymentsRequest;
use Inertia\Inertia;

class CustomerPaymentsController extends Controller
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
	    CustomerPayments::create($request->validated());
			if($request->has('booking_id')) {
				return Inertia::render('Booking/Show', [
          'booking' => $request->booking_id,
          'success' => 'Rezervasyon ödeme tahsilatı başarılı.'
        ]);
			} else {
				return Inertia::render('Customer/Show', [
          'customer' => $request->customer_id,
          'success' => 'Müşteri ödeme tahsilatı başarılı.'
        ]);
			}

    }

    /**
     * Display the specified resource.
     */
    public function show(CustomerPayments $customerPayments)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(CustomerPayments $customerPayments)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCustomerPaymentsRequest $request, CustomerPayments $customerPayments)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CustomerPayments $customerPayments)
    {
        //
    }
}
