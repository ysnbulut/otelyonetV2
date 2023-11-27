<?php

namespace App\Http\Controllers;

use App\Models\BankAccountInformation;
use App\Http\Requests\StoreBankAccountInformationRequest;
use App\Http\Requests\UpdateBankAccountInformationRequest;

class BankAccountInformationController extends Controller
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
    public function store(StoreBankAccountInformationRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(BankAccountInformation $bankAccountInformation)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(BankAccountInformation $bankAccountInformation)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBankAccountInformationRequest $request, BankAccountInformation $bankAccountInformation)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(BankAccountInformation $bankAccountInformation)
    {
        //
    }
}
