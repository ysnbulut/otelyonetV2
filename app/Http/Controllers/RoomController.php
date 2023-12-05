<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRoomRequest;
use App\Http\Requests\UpdateRoomRequest;
use App\Models\Floor;
use App\Models\Room;
use App\Models\TypeHasView;

class RoomController extends Controller
{
  /**
   * Display a listing of the resource.
   */
  public function index()
  {
    return view('hotel.pages.rooms.index', [
      'rooms' => Room::orderBy('id')
        ->with(['roomType', 'roomView', 'floor'])
        ->paginate(10)
        ->withQueryString()
        ->through(function ($room) {
          return [
            'id' => $room->id,
            'name' => $room->name,
            'type' => $room->roomType->name,
            'view' => $room->roomView->name,
            'floor' => $room->floor->name,
          ];
        }),
    ]);
  }

  /**
   * Store a newly created resource in storage.
   */
  public function store(StoreRoomRequest $request)
  {
    $data = $request->validated();
    $data['building_id'] = 1;
    $data['floor_id'] = 1;
    Room::create($data);
    return redirect()
      ->route('hotel.rooms.index')
      ->with('success', 'Oda ekleme başarılı.');
  }

  /**
   * Show the form for creating a new resource.
   */
  public function create()
  {
    return view('hotel.pages.rooms.create', [
//    TODO Burası kaldırılacak şimdilik katlara ihtiyaç yok
//   'floors' => Floor::orderBy('id')->get(['id', 'name']),
      'roomTypeHasViews' => TypeHasView::with(['type', 'view'])->get()->map(function ($typeHasView) {
        return [
          'id' => $typeHasView->id,
          'name' => $typeHasView->type->name . ' - ' . $typeHasView->view->name,
        ];
      }),
    ]);
  }

  /**
   * Display the specified resource.
   */
  public function show(Room $room)
  {
    //
  }

  /**
   * Show the form for editing the specified resource.
   */
  public function edit(Room $room)
  {
    return view('hotel.pages.rooms.edit', [
      'room' => $room,
      'floors' => Floor::orderBy('id')->get(['id', 'name']),
      'roomTypeHasViews' => TypeHasView::with(['type', 'view'])->get()->map(function ($typeHasView) {
        return [
          'id' => $typeHasView->id,
          'name' => $typeHasView->type->name . ' - ' . $typeHasView->view->name,
        ];
      }),
    ]);
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(UpdateRoomRequest $request, Room $room)
  {
    $room->fill($request->validated());
    $room->update($room->getDirty());
    return redirect()
      ->route('hotel.rooms.index')
      ->with('success', 'Oda güncelleme başarılı.');
  }

  /**
   * Remove the specified resource from storage.
   */
  public function destroy(Room $room)
  {
    $room->delete();
    return redirect()
      ->route('hotel.rooms.index')
      ->with('success', 'Oda silme başarılı.');
  }
}
