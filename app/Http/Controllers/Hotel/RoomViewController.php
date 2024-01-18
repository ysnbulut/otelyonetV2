<?php

namespace App\Http\Controllers\Hotel;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRoomViewRequest;
use App\Http\Requests\UpdateRoomViewRequest;
use App\Models\RoomView;
use Inertia\Inertia;

class RoomViewController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Hotel/RoomView/Index',[
            'roomViews' => RoomView::orderBy('id')->with(['roomTypes' => function ($query) {
                $query->select(['name']);
            }, 'rooms' => function ($query) {
                $query->select(['name']);
            }, 'unitPrices' => function ($query) {
                $query->with(['season' => function ($query) {
                    $query->select(['id', 'name']);
                }])->select(['season_id']);
            }])->get(['id',
                'name', 'description'])
                ->map(function ($roomView) {
                    $warningMessage = null;
                    if ($roomView->roomTypes->count() > 0) {
                        $warningMessage = $roomView->name . ' oda manzarası silindiğinde <b>' .
                            $roomView->roomTypes->pluck('name')
                                ->join(', ') . '</b> oda tiplerinden kaldırılacak';
                        $warningMessage .= $roomView->rooms->count() > 0 ? ' ve bunun sonucunda <b>' .
                            $roomView->roomTypes->pluck('name')
                                ->join(', ') . '</b> oda tiplerinde tanımlı <b>' . $roomView->rooms->pluck('name')
                                ->join(', ') .
                            '</b> odalarız silinecektir!' : 'tır!';
                    }
                    if($roomView->unitPrices->count() > 0) {
                        $warningMessage .= $warningMessage ? '<br/>' : '';
                        $warningMessage .= $roomView->name . ' silindiğinde <b>' . $roomView->unitPrices->map(fn
                            ($unitPrice) => $unitPrice->season !== null ? $unitPrice->season->name : '')->join(', ') .
                            '</b> sezonlarındaki fiyatlar silinecektir!';
                    }
                    return [
                        'id' => $roomView->id,
                        'name' => $roomView->name,
                        'description' => $roomView->description,
                        'warning_message' => $warningMessage,
                    ];
                })
        ]);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRoomViewRequest $request, RoomView $roomView)
    {
        $createdRoomView = $roomView->create($request->validated());
        $createdRoomView['roomTypesNames'] = null;
        $createdRoomView['roomsNames'] = null;
        $createdRoomView['unitPricesSeasonsNames'] = null;
        return $createdRoomView;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRoomViewRequest $request, RoomView $roomView)
    {
        $roomView->update($request->validated());
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(RoomView $roomView)
    {
        $roomView->rooms()->delete();
        $roomView->roomTypes()->detach();
        $roomView->unitPrices()->delete();
        $roomView->delete();
    }
}
