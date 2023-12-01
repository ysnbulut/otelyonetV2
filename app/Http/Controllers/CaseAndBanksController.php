<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCaseAndBanksRequest;
use App\Http\Requests\UpdateCaseAndBanksRequest;
use App\Models\CaseAndBanks;
use Illuminate\Support\Facades\Request;
use Inertia\Inertia;

class CaseAndBanksController extends Controller
{
  /**
   * Display a listing of the resource.
   */
  public function index()
  {
    return Inertia::render('Bank/Index', [
      'filters' => Request::all('search', 'trashed'),
      'banks' => CaseAndBanks::orderBy('id')
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
    CaseAndBanks::create($request->validated());
    return redirect()
      ->route('hotel.case_and_banks.index')
      ->with('success', 'Kasa oluşturma başarılı.');
  }

  /**
   * Show the form for creating a new resource.
   */
  public function create()
  {
    return view('hotel.pages.case-and-banks.create');
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
