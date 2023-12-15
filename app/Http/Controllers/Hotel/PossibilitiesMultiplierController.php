<?php

namespace App\Http\Controllers\Hotel;

use App\Http\Controllers\Controller;
use App\Models\PossibilitiesMultiplier;
use App\Http\Requests\StorePossibilitiesMultiplierRequest;
use App\Http\Requests\UpdatePossibilitiesMultiplierRequest;
use App\Models\RoomType;

class PossibilitiesMultiplierController extends Controller
{
 /**
  * Display a listing of the resource.
  */
 public function index()
 {
  return view('hotel.pages.possibilities-multipliers.index', [
   'roomTypes' => RoomType::paginate(10)
    ->withQueryString()
    ->through(
     fn($roomType) => [
      'id' => $roomType->id,
      'name' => $roomType->name,
      'size' => $roomType->size,
      'capacity' => $roomType->capacity,
     ]
    ),
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
 public function store(StorePossibilitiesMultiplierRequest $request)
 {
  $possibilitiesMultiplier = PossibilitiesMultiplier::create($request->validated());
  return redirect()
   ->back()
   ->with('success', 'Çarpan ekleme başarılı.');
 }

 /**
  * Display the specified resource.
  */
 public function show(RoomType $roomType)
 {
  return view('hotel.pages.possibilities-multipliers.show', [
   'roomType' => [
    'id' => $roomType->id,
    'name' => $roomType->name,
    'size' => $roomType->size,
    'capacity' => $roomType->capacity,
   ],
   'possibilities' => $roomType
    ->possibilitiesOfGuests()
    ->paginate(10)
    ->withQueryString()
    ->through(
     fn($possibility) => [
      'id' => $possibility->id,
      'number_of_adults' => $possibility->number_of_adults,
      'number_of_children' => $possibility->number_of_children,
      'children_ages' => $possibility->childAgeRanges->map(
       fn($childAgeRange) => [
        'id' => $childAgeRange->id,
        'min_age' => $childAgeRange->min_age,
        'max_age' => $childAgeRange->max_age,
       ]
      ),
      'possibility_multiplier' =>
       $possibility->possibilitiesMultipliers != null
        ? [
         'id' => $possibility->possibilitiesMultipliers->id,
         'multiplier' => $possibility->possibilitiesMultipliers->multiplier,
        ]
        : null,
     ]
    ),
  ]);
 }

 /**
  * Show the form for editing the specified resource.
  */
 public function edit(PossibilitiesMultiplier $possibilitiesMultiplier)
 {
  //
 }

 /**
  * Update the specified resource in storage.
  */
 public function update(UpdatePossibilitiesMultiplierRequest $request, $possibilitiesMultiplierId)
 {
  $possibilitiesMultiplier = PossibilitiesMultiplier::findOrFail($possibilitiesMultiplierId);
  $possibilitiesMultiplier->fill($request->validated());
  $possibilitiesMultiplier->update($possibilitiesMultiplier->getDirty());
  return redirect()
   ->back()
   ->with('success', 'Çarpan güncelleme başarılı.');
 }

 /**
  * Remove the specified resource from storage.
  */
 public function destroy(PossibilitiesMultiplier $possibilitiesMultiplier)
 {
  //
 }
}
