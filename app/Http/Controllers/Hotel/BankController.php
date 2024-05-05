<?php

namespace App\Http\Controllers\Hotel;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBanksRequest;
use App\Http\Requests\UpdateBanksRequest;
use App\Models\Bank;
use Illuminate\Support\Facades\Request;
use Inertia\Inertia;

class  BankController extends Controller
{
  /**
   * Display a listing of the resource.
   */
  public function index()
  {
    return Inertia::render('Hotel/Bank/Index', [
      'filters' => Request::all('search', 'trashed'),
      'banks' => Bank::orderBy('id')
        ->select('id', 'name', 'type', 'currency')
        ->paginate(Request::get('per_page') ?? 10)
        ->withQueryString()
        ->through(function ($bank) {
          return [
            'id' => $bank->id,
            'name' => $bank->name,
            'currency' => $bank->currency,
            'type' => $bank->type,
            //TODO burda kasadan çekilen tutarlarda eksi bakiye yazılacak sonrasında kasada bulunan meblağ yazılacak. ayrıca yıllık aylık için çalışma yapılmalı
            'balance' =>
              number_format($bank->transactions()->sum('amount'), 2, ',', '.') . ' ' . $bank->currency,
          ];
        }),
    ]);
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(StoreBanksRequest $request)
  {
    Bank::create($request->validated());
    return redirect()
      ->route('hotel.banks.index')
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
  public function show(Bank $banks)
  {
    //
  }

  /**
   * Show the form for editing the specified resource.
   */
  public function edit(Bank $banks)
  {
    return view('hotel.pages.case-and-banks.edit', [
      'banks' => $banks,
    ]);
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(UpdateBanksRequest $request, Bank $banks)
  {
    $banks->fill($request->validated());
    $banks->update($banks->getDirty());
    return redirect()
      ->route('hotel.banks.index')
      ->with('success', 'Kasa güncellendi.');
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(Bank $banks)
  {
    //
  }
}
