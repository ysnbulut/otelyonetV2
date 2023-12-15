<?php

namespace App\Http\Controllers\Hotel;

use App\Http\Controllers\Controller;
use App\Models\PossibilitiesOfGuestsRoomType;
use App\Models\RoomType;
use App\Http\Requests\StorePossibilitiesOfGuestsRoomTypeRequest;
use App\Http\Requests\UpdatePossibilitiesOfGuestsRoomTypeRequest;

class PossibilitiesOfGuestsRoomTypeController extends Controller
{
 /**
  * Display a listing of the resource.
  */
 public function index()
 {
  return view('hotel.pages.possibilities-of-guests.index', [
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
 public function create(RoomType $roomType)
 {
  return view('hotel.pages.possibilities-of-guests.create', [
   'roomType' => $roomType,
  ]);
 }

 /**
  * Store a newly created resource in storage.
  */
 public function store(StorePossibilitiesOfGuestsRoomTypeRequest $request, RoomType $roomType)
 {
  $roomType->possibilitiesOfGuests()->create($request->validated());
  return redirect()
   ->route('hotel.possibilities_of_guests.show', $roomType->id)
   ->withSuccess($roomType->name . ' için yeni varyasyon oluşturuldu!');
 }

 /**
  * Display the specified resource.
  */
 public function show(RoomType $roomType)
 {
  return view('hotel.pages.possibilities-of-guests.show', [
   'roomType' => [
    'id' => $roomType->id,
    'name' => $roomType->name,
    'size' => $roomType->size,
    'room_count' => $roomType->room_count,
    'capacity' => $roomType->capacity,
    'beds' => $roomType->beds->map(
     fn($bed) => [
      'id' => $bed->id,
      'name' => $bed->name,
      'person_num' => $bed->person_num,
     ]
    ),
    'views' => $roomType->views->map(
     fn($view) => [
      'id' => $view->id,
      'name' => $view->name,
     ]
    ),
   ],
   'possibilitiesOfGuests' => $roomType
    ->possibilitiesOfGuests()
    ->with(['childAgeRanges' => fn($query) => $query->select('id', 'possibility_id', 'min_age', 'max_age')])
    ->paginate(10)
    ->withQueryString()
    ->through(
     fn($possibilitiesOfGuests) => [
      'id' => $possibilitiesOfGuests->id,
      'number_of_adults' => $possibilitiesOfGuests->number_of_adults,
      'number_of_children' => $possibilitiesOfGuests->number_of_children,
      'children_ages' => $possibilitiesOfGuests->childAgeRanges->map(
       fn($childAgeRange) => [
        'id' => $childAgeRange->id,
        'min_age' => $childAgeRange->min_age,
        'max_age' => $childAgeRange->max_age,
       ]
      ),
     ]
    ),
  ]);
 }

 /**
  * Show the form for editing the specified resource.
  */
 public function edit(PossibilitiesOfGuestsRoomType $possibilitiesOfGuestsRoomType)
 {
  //
 }

 /**
  * Update the specified resource in storage.
  */
 public function update(
  UpdatePossibilitiesOfGuestsRoomTypeRequest $request,
  PossibilitiesOfGuestsRoomType $possibilitiesOfGuestsRoomType
 ) {
  //
 }

 /**
  * Remove the specified resource from storage.
  */
 public function destroy($possibilitiesOfGuestsRoomTypeId)
 {
  $possibilitiesOfGuestsRoomType = PossibilitiesOfGuestsRoomType::find($possibilitiesOfGuestsRoomTypeId);
  $possibilitiesOfGuestsRoomType->possibilitiesMultipliers()->delete();
  $possibilitiesOfGuestsRoomType->childAgeRanges()->delete();
  $possibilitiesOfGuestsRoomType->delete();
  return redirect()
   ->route('hotel.possibilities_of_guests.index')
   ->with('success', 'Misarif Varyasyonu silme başarılı.');
 }
}
