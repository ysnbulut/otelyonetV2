<?php

namespace App\Http\Controllers\Hotel;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCaseAndBanksRequest;
use App\Http\Requests\UpdateCaseAndBanksRequest;
use App\Models\CaseAndBank;
use Illuminate\Support\Facades\Request;
use Inertia\Inertia;

class CaseAndBanksController extends Controller
{
  /**
   * Display a listing of the resource.
   */
  public function index()
  {
    return Inertia::render('Hotel/Bank/Index', [
      'filters' => Request::all('search', 'trashed'),
      'banks' => CaseAndBank::orderBy('id')
        ->select('id', 'name', 'type', 'currency')
        ->paginate(Request::get('per_page') ?? 10)
        ->withQueryString()
        ->through(function ($caseAndBank) {
          return [
            'id' => $caseAndBank->id,
            'name' => $caseAndBank->name,
            'currency' => $caseAndBank->currency,
            'type' => $caseAndBank->type,
            //TODO burda kasadan çekilen tutarlarda eksi bakiye yazılacak sonrasında kasada bulunan meblağ yazılacak. ayrıca yıllık aylık için çalışma yapılmalı
            'balance' =>
              number_format($caseAndBank->transactions()->sum('amount_paid'), 2, ',', '.') . ' ' . $caseAndBank->currency,
          ];
        }),
    ]);
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(StoreCaseAndBanksRequest $request)
  {
    CaseAndBank::create($request->validated());
    return redirect()
      ->route('hotel.case_and_banks.index')
      ->with('success', 'Kasa oluşturma başarılı.');
  }

  /**
   * Show the form for creating a new resource.
   */
  public function create()
  {
    return Inertia::render('Hotel/Bank/Create');
  }

  /**
   * Display the specified resource.
   */
  public function show(CaseAndBank $caseAndBanks)
  {
    //
  }

  /**
   * Show the form for editing the specified resource.
   */
  public function edit(CaseAndBank $caseAndBanks)
  {
    return view('hotel.pages.case-and-banks.edit', [
      'caseAndBanks' => $caseAndBanks,
    ]);
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(UpdateCaseAndBanksRequest $request, CaseAndBank $caseAndBanks)
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
  public function destroy(CaseAndBank $caseAndBanks)
  {
    //
  }
}
