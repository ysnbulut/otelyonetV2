<?php

namespace App\Http\Controllers;

use App\Models\UnitPriceRoomTypeAndView;
use App\Models\TypeHasView;
use App\Models\Season;
use App\Http\Requests\StoreUnitPriceRoomTypeAndViewRequest;
use App\Http\Requests\UpdateUnitPriceRoomTypeAndViewRequest;
use App\Settings\GeneralSettings;
use Inertia\Inertia;

class UnitPriceRoomTypeAndViewController extends Controller
{
 /**
  * Display a listing of the resource.
  */
 public function index()
 {
	 $settings = new GeneralSettings();
  return Inertia::render('UnitPrice/Index',[
   'roomTypesAndViews' => TypeHasView::with(['type', 'view'])
    ->whereHas('rooms')
    ->get()->map(fn($typeHasView) => [
      'id' => $typeHasView->id,
     'name' => $typeHasView->typeAndViewName,
     'room_count' => $typeHasView->rooms->count(),
    ]),
	  'pricing_policy' => $settings->pricing_policy,
  ]);
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
 public function store(StoreUnitPriceRoomTypeAndViewRequest $request)
 {
  UnitPriceRoomTypeAndView::create($request->validated());
  return redirect()
   ->back()
   ->with('success', 'Fiyat ekleme başarılı.');
 }

 /**
  * Display the specified resource.
  */
 public function show(TypeHasView $typeHasView)
 {
  $settings = new GeneralSettings();
  return view('hotel.pages.unit-prices.show', [
   'typeHasView' => [
    'id' => $typeHasView->id,
    'name' => $typeHasView->typeAndViewName,
   ],
   'seasons' => Season::avilableSeasons()
    ->paginate(10)
    ->withQueryString()
    ->through(
     fn($season) => [
      'id' => $season->id,
      'name' => $season->seasonName,
      'unit_price' =>
       $season
        ->unitPrices()
        ->where('type_has_view_id', $typeHasView->id)
        ->first() ?? null,
     ]
    ),
   'off_season' =>
    UnitPriceRoomTypeAndView::where('type_has_view_id', $typeHasView->id)
     ->where('season_id', null)
     ->first(['id', 'type_has_view_id', 'unit_price']) ?? null,
   'currency' => $settings->pricing_currency,
  ]);
 }

 /**
  * Show the form for editing the specified resource.
  */
 public function edit(UnitPriceRoomTypeAndView $unitPriceRoomTypeAndView)
 {
  //
 }

 /**
  * Update the specified resource in storage.
  */
 public function update(UpdateUnitPriceRoomTypeAndViewRequest $request, $unitPriceRoomTypeAndViewId)
 {
  $unitPriceRoomTypeAndView = UnitPriceRoomTypeAndView::findOrFail($unitPriceRoomTypeAndViewId);
  $unitPriceRoomTypeAndView->fill($request->validated());
  $unitPriceRoomTypeAndView->update([
   'unit_price' => $request->unit_price,
  ]);
  return redirect()
   ->back()
   ->with('success', 'Unit price updated successfully');
 }

 /**
  * Remove the specified resource from storage.
  */
 public function destroy(UnitPriceRoomTypeAndView $unitPriceRoomTypeAndView)
 {
  //
 }
}
