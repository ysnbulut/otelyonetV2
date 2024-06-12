<?php

namespace App\Http\Controllers\Hotel;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRoomRequest;
use App\Http\Requests\UpdateRoomRequest;
use App\Models\Floor;
use App\Models\Room;
use App\Models\TypeHasView;
use Illuminate\Support\Facades\Request;
use Inertia\Inertia;

class RoomController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Hotel/Room/Index', [
            'filters' => Request::all('search', 'trashed'),
            'rooms' => Room::orderBy('id')
                ->filter(Request::only('search', 'trashed'))
                ->with(['roomType', 'roomView', 'floor'])
                ->get()
                ->map(function ($room) {
                    return [
                        'id' => $room->id,
                        'name' => $room->name,
                        'type' => $room->roomType->name,
                        'view' => $room->roomView->name,
                        'floor' => $room->floor->name,
                        'is_clean' => $room->is_clean,
                        'status' => $room->status,
                    ];
                }),
            'typeHasViews' => TypeHasView::with(['type', 'view'])->get()->map(function ($typeHasView) {
                return [
                    'id' => $typeHasView->id,
                    'name' => $typeHasView->type->name . ' ' . $typeHasView->view->name,
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
        $room = Room::create($data);
        return [
            'id' => $room->id,
            'name' => $room->name,
            'type' => $room->roomType->name,
            'view' => $room->roomView->name,
            'floor' => $room->floor->name,
            'is_clean' => $room->is_clean,
            'status' => $room->status,
        ];
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
        return $room->delete();
    }
}
