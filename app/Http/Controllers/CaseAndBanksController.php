<?php

namespace App\Http\Controllers;

use App\Models\CaseAndBanks;
use App\Http\Requests\StoreCaseAndBanksRequest;
use App\Http\Requests\UpdateCaseAndBanksRequest;

class CaseAndBanksController extends Controller
{
 /**
  * Display a listing of the resource.
  */
 public function index(): \Illuminate\View\View
 {
  return view('hotel.pages.case-and-banks.index', [
   'caseAndBanks' => CaseAndBanks::orderBy('id')
    ->select('id', 'name', 'type', 'currency')
    ->paginate(10)
    ->withQueryString()
    ->through(function ($caseAndBank) {
     return [
      'id' => $caseAndBank->id,
      'name' => $caseAndBank->name,
      'currency' => $caseAndBank->currency,
      'type' => $caseAndBank->type,
      'balance' =>
       number_format($caseAndBank->transactions()->sum('amount_paid'), 2, ',', '.') . ' ' . $caseAndBank->currency,
     ];
    }),
  ]);
 }

 /**
  * Show the form for creating a new resource.
  */
 public function create()
 {
  return view('hotel.pages.case-and-banks.create');
 }

 /**
  * Store a newly created resource in storage.
  */
 public function store(StoreCaseAndBanksRequest $request)
 {
  CaseAndBanks::create($request->validated());
  return redirect()
   ->route('hotel.case_and_banks.index')
   ->with('success', 'Kasa oluşturma başarılı.');
 }

 /**
  * Display the specified resource.
  */
 public function show(CaseAndBanks $caseAndBanks)
 {
  //
 }

 /**
  * Show the form for editing the specified resource.
  */
 public function edit(CaseAndBanks $caseAndBanks)
 {
  return view('hotel.pages.case-and-banks.edit', [
   'caseAndBanks' => $caseAndBanks,
  ]);
 }

 /**
  * Update the specified resource in storage.
  */
 public function update(UpdateCaseAndBanksRequest $request, CaseAndBanks $caseAndBanks)
 {
  $caseAndBanks->fill($request->validated());
  $caseAndBanks->update($caseAndBanks->getDirty());
  return redirect()
   ->route('hotel.case_and_banks.index')
   ->with('success', 'Kasa güncellendi.');
 }

 /**
  * Remove the specified resource from storage.
  */
 public function destroy(CaseAndBanks $caseAndBanks)
 {
  //
 }
}
