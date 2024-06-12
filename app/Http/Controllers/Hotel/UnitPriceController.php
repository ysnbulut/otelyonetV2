<?php

namespace App\Http\Controllers\Hotel;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUnitPriceRequest;
use App\Http\Requests\UpdateUnitPriceRequest;
use App\Models\BookingChannel;
use App\Models\Season;
use App\Models\Tax;
use App\Models\TypeHasView;
use App\Models\UnitPrice;
use App\Settings\PricingPolicySettings;
use Carbon\Carbon;
use Inertia\Inertia;

class UnitPriceController extends Controller
{
    protected PricingPolicySettings $settings;

    public function __construct()
    {
        $this->settings = new PricingPolicySettings();
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $activedChannels = BookingChannel::where('active', true)->get();
        return Inertia::render('Hotel/UnitPrice/Index', [ //Inertia::render('Hotel/UnitPrice/Index',
            'activatedChannels' => $activedChannels,
            'roomTypesAndViews' => TypeHasView::with(['type', 'view'])
                //TODO: Oda eklendiğinde burası görünecek oyuzden eventi notifiyi oda eklendiğinde tetikle
                ->whereHas('rooms')
                ->get()->map(function ($typeHasView) use ($activedChannels) {
                    $warning = false;
                    $seasons = Season::avilableSeasons()
                        ->get()
                        ->map(
                            function ($season) use ($typeHasView, &$warning, $activedChannels) {
                                $unit_prices = [];
                                if ($season->reception) {
                                    $reception_unit_prices = $season
                                        ->unitPrices()
                                        ->where('type_has_view_id', $typeHasView->id)
                                        ->where('booking_channel_id', $activedChannels->filter(fn($channel) => $channel->code === 'reception')->first()->id)
                                        ->get();
                                    $unit_prices = array_merge($unit_prices, $reception_unit_prices->toArray());
                                }
                                if ($season->web) {
                                    $web_unit_prices = $season
                                        ->unitPrices()
                                        ->where('type_has_view_id', $typeHasView->id)
                                        ->where('booking_channel_id', $activedChannels->filter(fn($channel) => $channel->code === 'web')->first()->id)
                                        ->get();
                                    $unit_prices = array_merge($unit_prices, $web_unit_prices->toArray());
                                }
                                if ($season->channels) {
                                    $channels_unit_prices = $season
                                        ->unitPrices()
                                        ->where('type_has_view_id', $typeHasView->id)
                                        ->whereIn('booking_channel_id', $activedChannels->filter(fn($channel) => $channel->code !== 'web' && $channel->code !== 'reception' &&
                                            $channel->code !== 'agency' && $channel->code !== 'online')
                                            ->pluck
                                            ('id'))
                                        ->get();
                                    $unit_prices = array_merge($unit_prices, $channels_unit_prices->toArray());
                                }
                                if ($season->agency) {
                                    $agency_unit_prices = $season
                                        ->unitPrices()
                                        ->where('type_has_view_id', $typeHasView->id)
                                        ->where('booking_channel_id', $activedChannels->filter(fn($channel) => $channel->code === 'agency')->first()->id)
                                        ->get();
                                    $unit_prices = array_merge($unit_prices, $agency_unit_prices->toArray());
                                }
                                $warning = count($unit_prices) < count($activedChannels) || collect($unit_prices)->filter(fn($unit_price) => $unit_price->unit_price === null)->count() > 0;
                                return [
                                    'id' => $season->id,
                                    'name' => $season->name,
                                    'start_date' => $season->start_date,
                                    'end_date' => $season->end_date,
                                    'unit_prices' => $unit_prices,
                                    'channels' => $season->channels,
                                    'web' => $season->web,
                                    'agency' => $season->agency,
                                    'reception' => $season->reception,
                                ];
                            }
                        );
                    $reception_base_unit_price =
                        UnitPrice::select(['id', 'unit_price', 'booking_channel_id'])
                            ->where('type_has_view_id', $typeHasView->id)
                            ->whereNull('season_id')
                            ->where('booking_channel_id', $activedChannels->filter(fn($channel) => $channel->code === 'reception')->first()->id)
                            ->first();
                    $web_base_unit_price =
                        UnitPrice::select(['id', 'unit_price', 'booking_channel_id'])
                            ->where('type_has_view_id', $typeHasView->id)
                            ->whereNull('season_id')
                            ->where('booking_channel_id', $activedChannels->filter(fn($channel) => $channel->code === 'web')->first()->id)
                            ->first();
                    $channels_base_unit_price =
                        UnitPrice::select(['id', 'unit_price', 'booking_channel_id'])
                            ->where('type_has_view_id', $typeHasView->id)
                            ->whereNull('season_id')
                            ->whereNull('booking_channel_id')
                            ->first();
                    return [
                        'id' => $typeHasView->id,
                        'name' => $typeHasView->typeAndViewName,
                        'roomCount' => $typeHasView->rooms->count(),
                        'warning' => $warning || empty($seasons->toArray()) || $reception_base_unit_price === null || $web_base_unit_price === null || $channels_base_unit_price === null,
                        'seasons' => $seasons,
                        'unit_reception_base_price' => [
                            'id' => null,
                            'name' => 'Resepsiyon',
                            'unit_prices' => $reception_base_unit_price,
                        ],
                        'unit_web_base_price' => [
                            'id' => null,
                            'name' => 'Web',
                            'unit_prices' => $web_base_unit_price,
                        ],
                        'unit_channels_base_price' => [
                            'id' => null,
                            'name' => 'Diğer Kanallar',
                            'unit_prices' => $channels_base_unit_price,
                        ],
                    ];
                }),
            'pricingCurrency' => $this->settings->pricing_currency['value'],
            'pricingPolicy' => $this->settings->pricing_policy['value'],
            'taxRate' => Tax::find($this->settings->tax_rate['value'])->rate / 100,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUnitPriceRequest $request): \Illuminate\Http\RedirectResponse
    {
        $data = $request->validated();
        $data['unit_price'] = (double)str_replace(',', '.', $data['unit_price']);
        if ($data['season_id'] === null) {
            if ($data['booking_channel_id'] === null) {
                $check = UnitPrice::where('type_has_view_id', $data['type_has_view_id'])->whereNull('season_id')->whereNull('booking_channel_id')->exists();
            } else {
                $check = UnitPrice::where('type_has_view_id', $data['type_has_view_id'])->whereNull('season_id')->where('booking_channel_id', $data['booking_channel_id'])->exists();
            }
        } else {
            $check = UnitPrice::where('type_has_view_id', $data['type_has_view_id'])->where('season_id', $data['season_id'])->where('booking_channel_id', $data['booking_channel_id'])->exists();
        }
        if ($check) {
            return redirect()->back()->with(['error' => 'Bu fiyat zaten ekli.'], 400);
        }
        UnitPrice::create($data);
        return redirect()->back()->with('success', 'Fiyat başarıyla eklendi.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUnitPriceRequest $request, $unitPriceRoomTypeAndViewId): void
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
    public function destroy(UnitPrice $unitPrice): void
    {
        //
    }
}