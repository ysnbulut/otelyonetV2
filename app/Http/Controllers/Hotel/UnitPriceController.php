<?php

namespace App\Http\Controllers\Hotel;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUnitPriceRequest;
use App\Http\Requests\UpdateUnitPriceRequest;
use App\Models\Season;
use App\Models\TypeHasView;
use App\Models\UnitPrice;
use App\Models\UnitPriceRoomTypeAndView;
use App\Settings\PricingPolicySettings;
use Inertia\Inertia;

class UnitPriceController extends Controller
{
    protected PricingPolicySettings $settings;

    public function __construct()
    {
        $this->settings = new PricingPolicySettings();
    }

    public function test()
    {
        return [
            'roomTypesAndViews' => TypeHasView::with(['type', 'view'])
                //TODO: Oda eklendiğinde burası görünecek oyuzden eventi notifiyi oda eklendiğinde tetikle
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
                        UnitPrice::select(['id', 'unit_price'])
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
            'pricingCurrency' => $this->settings->pricing_currency['value'],
            'pricingPolicy' => $this->settings->pricing_policy['value'],
        ];
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Hotel/UnitPrice/Index',[
            'roomTypesAndViews' => TypeHasView::with(['type', 'view'])
                //TODO: Oda eklendiğinde burası görünecek oyuzden eventi notifiyi oda eklendiğinde tetikle
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
                        UnitPrice::select(['id', 'unit_price'])
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
            'pricingCurrency' => $this->settings->pricing_currency['value'],
            'pricingPolicy' => $this->settings->pricing_policy['value'],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUnitPriceRequest $request)
    {
        $data = $request->validated();
        $data['unit_price'] = (double) str_replace(',', '.', $data['unit_price']);
        UnitPrice::create($data);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUnitPriceRequest $request, $unitPriceRoomTypeAndViewId)
    {
        $data = $request->validated();
        $unitPriceRoomTypeAndView = UnitPrice::findOrFail((int)$unitPriceRoomTypeAndViewId);
        $unitPriceRoomTypeAndView->update([
            'unit_price' => (double)str_replace(',', '.', $data['unit_price']),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(UnitPrice $unitPrice)
    {
        //
    }
}