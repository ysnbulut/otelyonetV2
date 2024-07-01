<?php

namespace App\Http\Controllers\Hotel;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBedTypeRequest;
use App\Http\Requests\UpdateBedTypeRequest;
use App\Models\BedType;
use Inertia\Inertia;

class BedTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Hotel/BedType/Index', [
            'bedTypes' => BedType::orderBy('id')->with(['roomTypes' => function ($query) {
                $query->select(['name']);
            }])->get(['id', 'name', 'person_num', 'description'])->map(fn($bedType) => [
                'id' => $bedType->id,
                'name' => $bedType->name,
                'person_num' => $bedType->person_num,
                'description' => $bedType->description,
                'warning_message' => $bedType->roomTypes->count() > 0 ?
                    $bedType->name . ' adlı yatak tipini sildiğinizde, oda manzarasını tanımlandığı  <b>' .
                    $bedType->roomTypes->pluck('name')->join(', ') . '</b> oda tiplerinden kaldırmış olursunuz. Bunun sonucunda da <b>' . $bedType->roomTypes->pluck('name')->join(', ') . ' </b> oda tiplerinde tanımlı odalarınızdan <b>' . $bedType->name . '</b> yatakları kaldırılmış olur.' : null,
            ])
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBedTypeRequest $request, BedType $bedType)
    {
        $createdBedType = $bedType->create($request->validated());
        $createdBedType['roomTypesNames'] = null;
        return $createdBedType;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBedTypeRequest $request, BedType $bedType)
    {
        $bedType->fill($request->validated());
        $bedType->update($bedType->getDirty());
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(BedType $bedType)
    {
        $bedType->roomTypes()->detach();
        $bedType->delete();
    }
}
