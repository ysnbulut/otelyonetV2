<?php

namespace App\Http\Controllers\Hotel;

use App\Http\Controllers\Controller;

use App\Http\Requests\StoreVariationRequest;
use App\Http\Requests\UpdateVariationRequest;
use App\Models\RoomType;
use App\Models\VariationMultiplier;
use Inertia\Inertia;

class GuestVariationMultiplierController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Hotel/GuestVariation/Index', [
            'roomTypes' => RoomType::whereHas('rooms')
                ->get()->map(function ($type) {
                    $warning = false;
                    $variations = $type->variationsOfGuests->map(
                        function ($variation) use (&$warning) {
                            $warning = $variation->multiplier === null;
                            return [
                                'id' => $variation->id,
                                'number_of_adults' => $variation->number_of_adults,
                                'number_of_children' => $variation->number_of_children,
                                'multiplier' => $variation->multiplier,
                            ];
                        }
                    );
                    return [
                        'id' => $type->id,
                        'name' => $type->name,
                        'roomCount' => $type->rooms->count(),
                        'warning' => $warning || empty($type->variationsOfGuests),
                        'variations' => $variations,
                    ];
                }),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreVariationRequest $request)
    {
        $data = $request->validated();
        $data['multiplier'] = (double) str_replace(',', '.', $data['multiplier']);
        VariationMultiplier::create($data);
    }


    public function update(UpdateVariationRequest $request, $variationId)
    {
        $variation = VariationMultiplier::findOrFail((int) $variationId);
        $variation->fill($request->validated());
        $variation->update([
            'multiplier' => (double) str_replace(',', '.', $request->multiplier),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(VariationMultiplier $VariationMultiplier)
    {
        $VariationMultiplier->delete();
    }
}
