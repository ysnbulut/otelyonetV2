<?php

namespace App\Http\Controllers\Hotel;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSalesUnitRequest;
use App\Http\Requests\UpdateSalesUnitRequest;
use App\Models\Item;
use App\Models\SalesChannel;
use App\Models\SalesUnit;
use Inertia\Inertia;

class SalesUnitController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Hotel/SalesUnit/Index',[
            'salesUnits' => SalesUnit::with(['areas' => function($query) {
                $query->select('id', 'name', 'sales_unit_id');
            }])->orderBy('id', 'desc')->get(['id', 'name', 'description'])->map(fn($salesUnit) => [
                'id' => $salesUnit->id,
                'name' => $salesUnit->name,
                'description' => $salesUnit->description,
                'areas' => $salesUnit->areas->map(fn($area) => [
                    'id' => $area->id,
                    'name' => $area->name
                ])
            ])
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Hotel/SalesUnit/Create', [
            'channels' => SalesChannel::all(['id', 'name']),
            'items' => Item::all(['id', 'name']),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSalesUnitRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(SalesUnit $salesUnit)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(SalesUnit $salesUnit)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSalesUnitRequest $request, SalesUnit $salesUnit)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SalesUnit $salesUnit)
    {
        //
    }
}
