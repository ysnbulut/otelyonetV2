<?php

use App\Helpers\PriceCalculator;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\HotelController;
use App\Http\Controllers\Site\IndexController;
use App\Http\Controllers\SyncController;
use App\Models\BedType;
use App\Models\Booking;
use App\Models\Customer;
use App\Models\Tenant;
use App\Models\TypeHasView;
use App\Settings\PricingPolicySettings;
use Carbon\Carbon;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('admin.dashboard.index');
    Route::prefix('/hotels')->group(function () {
        Route::get('/', [HotelController::class, 'index'])->name('admin.hotels.index');
        Route::get('/create', [HotelController::class, 'create'])->name('admin.hotels.create');
        Route::get('/{hotel}', [HotelController::class, 'show'])->name('admin.hotels.show');
        Route::post('/', [HotelController::class, 'store'])->name('admin.hotels.store');
        Route::get('/{hotel}/edit', [HotelController::class, 'edit'])->name('admin.hotels.edit');
        Route::put('/{hotel}', [HotelController::class, 'update'])->name('admin.hotels.update');
        Route::delete('/{hotel}', [HotelController::class, 'destroy'])->name('admin.hotels.destroy');
        Route::put('/{hotel}/settings', [HotelController::class, 'settings'])->name('admin.hotels.settings');
        Route::post('/{hotel}/cmroom', [HotelController::class, 'CmRoomsStore'])->name('admin.hotels.cmroomstore');
        Route::get('/{hotel}/active_channels', [HotelController::class, 'setActiveChannels'])->name('admin.hotels.active_channels');
        Route::get('/{hotel}/retrieve_reservations', [HotelController::class, 'retrieveReservations'])->name('admin.hotels.retrieve_reservations');
    });
//    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
//    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
//    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});
//Route::get('/', [IndexController::class, 'index'])->name('site.index');

Route::get('/bla', function () {

    $response = [];
    Tenant::all()->each(function ($tenant) use (&$response) {
        $response[$tenant->id] = $tenant->run(function () {
            $settings = new PricingPolicySettings();
            $priceCalculator = new PriceCalculator();
            $unavailableRoomsIds = Booking::getUnavailableRoomsIds(Carbon::createFromFormat('d.m.Y H:i:s', '12.08.2024' . ' ' . $settings->check_in_time_policy['value'] . ':00')
                ->format('Y-m-d H:i:s'), Carbon::createFromFormat('d.m.Y H:i:s', '22.08.2024' . ' ' . $settings->check_out_time_policy['value'] . ':00')->format('Y-m-d H:i:s'));
            $roomResults = TypeHasView::with([
                'view',
                'rooms' => function ($query) use ($unavailableRoomsIds) {
                    $query->whereNotIn('id', $unavailableRoomsIds);
                }
            ])->whereHas('rooms', function ($query) use ($unavailableRoomsIds) {
                $query->whereNotIn('id', $unavailableRoomsIds);
            })->whereHas('type', function ($query) {
                $query->with(['beds', 'features'])->where('adult_capacity', '>=', 2)->where('child_capacity', '>=', 0);
            })->get()->map(function ($typeHasViews) use ($priceCalculator) {
                return [
                    'id' => $typeHasViews->id,
                    'name' => $typeHasViews->type->name . ' ' . $typeHasViews->view->name,
                    'photos' => $typeHasViews->type->getMedia('room_type_photos')->map(fn($media) => $media->getUrl()),
                    'size' => $typeHasViews->type->size,
                    'room_count' => $typeHasViews->type->room_count,
                    'available_room_count' => $typeHasViews->rooms->count(),
                    'adult_capacity' => $typeHasViews->type->adult_capacity,
                    'child_capacity' => $typeHasViews->type->child_capacity,
                    'beds' => $typeHasViews->type->beds->map(
                        fn($bed) => [
                            'name' => $bed->name,
                            'person_num' => $bed->person_num,
                            'count' => $bed->pivot->count,
                        ]
                    ),
                    'features' => $typeHasViews->type->features->map(fn($feature) => $feature->name),
                    'rooms' => $typeHasViews->rooms->count() > 0 ? $typeHasViews->rooms->map(
                        fn($room) => [
                            'id' => $room->id,
                            'name' => $room->name,
                        ]
                    ) : false,
                    'prices' => $priceCalculator->prices(
                        $typeHasViews->id,
                        '12.08.2024',
                        '22.08.2024',
                        2,
                        0,
                        []
                    ),
                ];
            });
            return [
                'currency' => $settings->currency['value'],
                'data' => $roomResults,
            ];
        });
    });
    return $response;
});

Route::get('/syncwebhookerrors', [SyncController::class, 'index'])->name('test.index');

require __DIR__ . '/auth.php';
