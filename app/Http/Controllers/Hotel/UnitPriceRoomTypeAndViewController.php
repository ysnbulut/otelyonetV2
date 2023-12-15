<?php

namespace App\Http\Controllers\Hotel;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUnitPriceRoomTypeAndViewRequest;
use App\Http\Requests\UpdateUnitPriceRoomTypeAndViewRequest;
use App\Models\Season;
use App\Models\TypeHasView;
use App\Models\UnitPriceRoomTypeAndView;
use App\Settings\GeneralSettings;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class UnitPriceRoomTypeAndViewController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $settings = new GeneralSettings();
        return Inertia::render('Hotel/UnitPrice/Index', [
            'roomTypesAndViews' => TypeHasView::with(['type', 'view'])
                ->whereHas('rooms')
                ->get()->map(function ($typeHasView) {
                    $warning = false;
                    $seasons = Season::avilableSeasons()
                        ->get()
                        ->map(
                            function ($season) use ($typeHasView, &$warning) {
                                $unit_price = $season
                                    ->unitPrices()
                                    ->where('type_has_view_id', $typeHasView->id)
                                    ->first() ?? null;
                                $warning = $unit_price === null || $unit_price->unit_price === null;
                                return [
                                    'id' => $season->id,
                                    'name' => $season->seasonName,
                                    'unit_price' => $unit_price,

                                ];
                            }
                        );
                    $off_season_unit_price =
                        UnitPriceRoomTypeAndView::select(['id', 'unit_price'])
                            ->where('type_has_view_id', $typeHasView->id)
                            ->where('season_id', null)
                            ->first() ?? null;
                    return [
                        'id' => $typeHasView->id,
                        'name' => $typeHasView->typeAndViewName,
                        'roomCount' => $typeHasView->rooms->count(),
                        'warning' => $warning || empty($seasons->toArray()) || $off_season_unit_price === null,
                        'seasons' => $seasons,
                        'off_season' => [
                            'id' => null,
                            'unit_price' => $off_season_unit_price,
                        ],
                    ];
                }),
            'pricingCurrency' => $settings->pricing_currency,
            'pricingPolicy' => $settings->pricing_policy,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUnitPriceRoomTypeAndViewRequest $request)
    {
        $data = $request->validated();
        $data['unit_price'] = (double) str_replace(',', '.', $data['unit_price']);
        UnitPriceRoomTypeAndView::create($data);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
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
        $unitPriceRoomTypeAndView = UnitPriceRoomTypeAndView::findOrFail((int) $unitPriceRoomTypeAndViewId);
        $unitPriceRoomTypeAndView->fill($request->validated());
        $unitPriceRoomTypeAndView->update([
            'unit_price' => (double) str_replace(',', '.', $request->unit_price),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(UnitPriceRoomTypeAndView $unitPriceRoomTypeAndView)
    {
        //
    }
}
