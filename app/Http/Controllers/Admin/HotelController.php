<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\ChannelManagers;
use App\Http\Controllers\Controller;
use App\Http\Requests\HotelChannelManagerStoreRequest;
use App\Http\Requests\StoreCMRoomRequest;
use App\Http\Requests\StoreHotelsRequest;
use App\Http\Requests\UpdateHotelsRequest;
use App\Models\Bank;
use App\Models\BookingChannel;
use App\Models\Building;
use App\Models\Citizen;
use App\Models\CMRoom;
use App\Models\District;
use App\Models\Floor;
use App\Models\Hotel;
use App\Models\Province;
use App\Models\TaxOffice;
use App\Models\Tenant;
use App\Models\TypeHasView;
use App\Models\User;
use App\Settings\HotelSettings;
use App\Settings\PricingPolicySettings;
use Carbon\Carbon;
use GuzzleHttp\Exception\GuzzleException;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Spatie\LaravelSettings\Exceptions\SettingAlreadyExists;
use Spatie\LaravelSettings\Migrations\SettingsMigrator;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class HotelController extends Controller
{
    protected SettingsMigrator $migrator;

    public function __construct()
    {
        $this->migrator = app(SettingsMigrator::class);
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Admin/Hotel/Index', [
            'filters' => Request::all('search', 'trashed'),
            'hotels' => Hotel::select([
                'id',
                'tenant_id',
                'status',
                'name',
                'register_date',
                'renew_date',
                'price',
                'renew_price',
                'title',
                'address',
                'province_id',
                'district_id',
                'location',
                'tax_office_id',
                'tax_number',
                'phone',
                'email',
            ])->orderBy('id', 'desc')
                ->filter(Request::only('search', 'trashed'))
                ->paginate(Request::get('per_page') ?? 10)
                ->withQueryString()
                ->through(function ($hotel) {
                    return [
                        ...$hotel->toArray(),
                        'province' => $hotel->province->name,
                        'district' => $hotel->district->name,
                        'tax_office' => $hotel->tax_office?->tax_office,
                        'panel_url' => 'https://' . $hotel->tenant->domains->first()->domain . '/',
                        'webhook_url' => 'https://otelyonet.com/api/' . $hotel->tenant->id . '/webhook/booking',
                    ];
                }),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreHotelsRequest $request): \Illuminate\Http\RedirectResponse
    {
        $data = $request->validated();
        $tenant = Tenant::create();
        $tenant->domains()->create(['domain' => $data['subdomain'] . '.otelyonet.com']);

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
        return redirect()->route('admin.hotels.index')->with('success', 'Otel oluşturuldu.');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): \Inertia\Response
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
    public function show(Hotel $hotel): \Inertia\Response
    {
        $tenant = $hotel->tenant;
        $settings = null;
        $typeHasViews = null;
        $tenant->run(function () use (&$settings, &$typeHasViews) {
            $settings = new HotelSettings();
            $typeHasViews = TypeHasView::all();
        });
        return Inertia::render('Admin/Hotel/Show', [
            'hotel' => [
                ...$hotel->toArray(),
                'province' => $hotel->province->name,
                'district' => $hotel->district->name,
                'tax_office' => $hotel->tax_office?->tax_office,
                'panel_url' => 'https://' . $hotel->tenant->domains->first()->domain . '/',
                'webhook_url' => 'https://otelyonet.com/api/' . $hotel->tenant->id . '/webhook/booking',
            ],
            'tenant' => [
                ...$hotel->tenant->toArray(),
                'domains' => $hotel->tenant->domains->pluck('domain'),
                'settings' => $settings->toArray(),
                'type_has_views' => $typeHasViews->map(function ($typeHasView) {
                    return [
                        'value' => $typeHasView->id,
                        'label' => $typeHasView->type->name . ' ' . $typeHasView->view->name,
                        'count' => $typeHasView->rooms->count(),
                    ];
                })->toArray(),
            ],
        ]);
    }

    /**
     * @throws GuzzleException
     */
    public function channel_manager(Hotel $hotel, HotelChannelManagerStoreRequest $request): ?array
    {
        $tenant = $hotel->tenant;
        $request->validated();
        $tenant->run(function () use ($request) {
            $settings = new HotelSettings();
            $settingsData = $settings->toArray();
            if ($request->channel_manager !== 'closed' && $request->channel_manager !== $settingsData['channel_manager']['value']) {
                $settingsData['channel_manager']['value'] = $request->channel_manager;
                $settingsData['api_settings']['token'] = $request->api_token;
                $settingsData['api_settings']['hr_id'] = $request->api_hr_id;
            } else {
                if ($request->channel_manager === 'closed') {
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
        if ($request->channel_manager === 'closed') {
            return [
                'status' => 'success',
                'message' => 'Kanal yöneticisi kapatıldı.',
                'rooms' => [],
            ];
        } else {
            if ($request->api_token !== null && $request->api_hr_id !== null) {
                $channelManagers = new ChannelManagers($request->channel_manager, ['token' => $request->api_token, 'hr_id' => $request->api_hr_id]);
                return [
                    'status' => 'success',
                    'message' => 'Kanal yöneticisi başarıyla güncellendi.',
                    'rooms' => $channelManagers->getRooms()['rooms'] ?? [],
                ];
            } else {
                return [
                    'status' => 'error',
                    'message' => 'Kanal yöneticisi güncellenirken bir hata oluştu.',
                    'rooms' => [],
                ];
            }
        }
    }

    public function setActiveChannels(Hotel $hotel)
    {
        return $hotel->tenant->run(/**
         * @throws GuzzleException
         */ function () use (&$settings) {
            $settings = new HotelSettings();
            if ($settings->channel_manager['value'] === 'closed') {
                return [
                    'status' => 'error',
                    'message' => 'Kanal yöneticisi kapalı.',
                ];
            }
            $channelManagers = new ChannelManagers($settings->channel_manager['value'], ['token' => $settings->api_settings['token'], 'hr_id' => $settings->api_settings['hr_id']]);
            $connectedChannels = $channelManagers->getChannelList();
            foreach ($connectedChannels['channels'] as $channel) {
                if (BookingChannel::where('code', $channel['code'])->exists()) {
                    BookingChannel::where('code', $channel['code'])->update([
                        'active' => true,
                    ]);
                }
            }
            return [
                'status' => 'success',
                'message' => 'Kanal yöneticileri aktif edildi.',
            ];
        });
    }

    public function CmRoomsStore(Hotel $hotel, StoreCMRoomRequest $request): \Illuminate\Http\RedirectResponse
    {
        $request->validated();
        $tenant = $hotel->tenant;
        $request->cm_room_code = str_replace('HR:', '', $request->cm_room_code);
        $tenant->run(function () use ($request) {
            $cmRoom = CMRoom::where('type_has_view_id', $request->type_has_view_id)
                ->orWhere('room_code', $request->cm_room_code)
                ->first();
            if ($cmRoom) {
                $cmRoom->update([
                    'type_has_view_id' => $request->type_has_view_id,
                    'room_code' => $request->cm_room_code,
                    'stock' => $request->stock,
                ]);
            } else {
                CMRoom::create([
                    'type_has_view_id' => $request->type_has_view_id,
                    'room_code' => $request->cm_room_code,
                    'stock' => $request->stock,
                ]);
            }
        });
        return redirect()->route('admin.hotels.show', $hotel->id)->with('success', 'Oda ataması eklendi.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateHotelsRequest $request, Hotel $hotels)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Hotel $hotels)
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
