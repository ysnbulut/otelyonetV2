<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\HotelChannelManagerStoreRequest;
use App\Http\Requests\StoreHotelsRequest;
use App\Http\Requests\UpdateHotelsRequest;
use App\Models\District;
use App\Models\Hotel;
use App\Models\Province;
use App\Models\TaxOffice;
use App\Models\Tenant;
use App\Models\TypeHasView;
use App\Settings\HotelSettings;
use Carbon\Carbon;
use Illuminate\Support\Facades\Artisan;
use Inertia\Inertia;
use App\Helpers\ChannelManagers;

class HotelController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        Inertia::render('Admin/Hotel/Index', [
            'hotels' => Hotel::all(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreHotelsRequest $request)
    {
        $data = $request->validated();
        $tenant = Tenant::create();
        $tenant->domains()->create(['domain' => $data['subdomain'] . '.otelyonet.com']);
        $tenant->run(function () {
            Artisan::call('db:seed', ['--class' => 'DatabaseSeeder']);
            Artisan::call('db:seed', ['--class' => 'TenantChannelManagerSeeder']);
            Artisan::call('db:seed', ['--class' => 'TenantCitizenSeeder']);
            Artisan::call('db:seed', ['--class' => 'TenantPricingPolicySettingsSeeder']);
        });
        $data['status'] = 'active';
        $data['register_date'] = Carbon::parse($data['register_date'])->format('Y-m-d');
        $data['renew_date'] = Carbon::parse($data['renew_date'])->format('Y-m-d');
        $tenant->hotel()->create([
            'status' => $data['status'],
            'name' => $data['name'],
            'register_date' => $data['register_date'],
            'renew_date' => $data['renew_date'],
            'price' => $data['price'],
            'renew_price' => $data['renew_price'],
            'title' => $data['title'],
            'address' => $data['address'],
            'province_id' => $data['province_id'],
            'district_id' => $data['district_id'],
            'tax_office_id' => $data['tax_office_id'],
            'tax_number' => $data['tax_number'],
            'phone' => $data['phone'],
            'email' => $data['email'],
        ]);
        return redirect()->route('admin.hotels.index')->with('success', 'Müşteri oluşturuldu.');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Hotel/Create', [
            'provinces' => Province::all(['id', 'name']),
            'districts' => District::all(['id', 'province_id', 'name']),
            'tax_offices' => TaxOffice::all(['id', 'province_id', 'tax_office']),
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Hotel $hotel)
    {
        $tenant = $hotel->tenant;
        $settings = null;
        $typeHasViews = null;
        $tenant->run(function () use (&$settings, &$typeHasViews) {
            $settings = new HotelSettings();
            $typeHasViews = TypeHasView::all();
        });
        return Inertia::render('Admin/Hotel/Show',[
            'hotel' => [
                ...$hotel->toArray(),
                'province' => $hotel->province->name,
                'district' => $hotel->district->name,
                'tax_office' => $hotel->tax_office->tax_office,
                'panel_url' => 'https://' . $hotel->tenant->domains->first()->domain . '/',
            ],
            'tenant' => [
                ...$hotel->tenant->toArray(),
                'domains' => $hotel->tenant->domains->pluck('domain'),
                'settings' => $settings->toArray(),
                'type_has_views' => $typeHasViews->map(function ($typeHasView) {
                    return [
                        'value' => $typeHasView->id,
                        'label' => $typeHasView->type->name . ' '. $typeHasView->view->name.' - '.$typeHasView->rooms->count().' Oda'
                    ];
                })->toArray(),
            ],
        ]);
    }

    public function channel_manager(Hotel $hotel, HotelChannelManagerStoreRequest $request)
    {
        $tenant = $hotel->tenant;
        $request->validated();
        $tenant->run(function () use ($request) {
            $settings = new HotelSettings();
            $settingsData = $settings->toArray();
            if($request->channel_manager !== 'closed' && $request->channel_manager !==
                $settingsData['channel_manager']['value']) {
                $settingsData['channel_manager']['value'] = $request->channel_manager;
                $settingsData['api_settings']['token'] = $request->api_token;
                $settingsData['api_settings']['hr_id'] = $request->api_hr_id;
            } else {
                if($request->channel_manager === 'closed') {
                    $settingsData['channel_manager']['value'] = $request->channel_manager;
                    $settingsData['api_settings'] = [];
                } else {
                    $settingsData['api_settings']['token'] = $request->api_token;
                    $settingsData['api_settings']['hr_id'] = $request->api_hr_id;
                }
            }
            $settings->fill($settingsData);
            $settings->save();
        });
        $channelManagers = new ChannelManagers($request->channel_manager, ['token' => $request->api_token, 'hr_id' => $request->api_hr_id]);
        return $channelManagers->getRooms();
    }

    public function channel_manager_rooms(Hotel $hotel)
    {
        $tenant = $hotel->tenant;
        $settings = null;
        $tenant->run(function () use (&$settings) {
            $settings = new HotelSettings();
        });

    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Hotel $hotels)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateHotelsRequest $request, Hotel $hotels)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Hotel $hotels)
    {
        //
    }
}
