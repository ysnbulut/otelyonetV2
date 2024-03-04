<?php

declare(strict_types=1);

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Hotel\BedTypeController;
use App\Http\Controllers\Hotel\BookingController;
use App\Http\Controllers\Hotel\BookingGuestsController;
use App\Http\Controllers\Hotel\BookingRoomsController;
use App\Http\Controllers\Hotel\CaseAndBanksController;
use App\Http\Controllers\Hotel\CustomerController;
use App\Http\Controllers\Hotel\BookingPaymentsController;
use App\Http\Controllers\Hotel\DashboardController;
use App\Http\Controllers\Hotel\FloorController;
use App\Http\Controllers\Hotel\GuestController;
use App\Http\Controllers\Hotel\GuestVariationMultiplierController;
use App\Http\Controllers\Hotel\HotelRunnerController;
use App\Http\Controllers\Hotel\PricingPolicySettingsController;
use App\Http\Controllers\Hotel\ProductsController;
use App\Http\Controllers\Hotel\RoleController;
use App\Http\Controllers\Hotel\RoomController;
use App\Http\Controllers\Hotel\RoomTypeController;
use App\Http\Controllers\Hotel\RoomTypeFeatureController;
use App\Http\Controllers\Hotel\RoomViewController;
use App\Http\Controllers\Hotel\SalesUnitController;
use App\Http\Controllers\Hotel\SeasonController;
use App\Http\Controllers\Hotel\UnitPriceController;
use App\Http\Controllers\Hotel\UserController;
use App\Http\Controllers\MediaController;
use App\Models\SalesUnit;
use App\Models\Season;
use Illuminate\Support\Facades\Route;
use Stancl\Tenancy\Middleware\InitializeTenancyByDomain;
use Stancl\Tenancy\Middleware\PreventAccessFromCentralDomains;


/*
|--------------------------------------------------------------------------
| Tenant Routes
|--------------------------------------------------------------------------
|
| Here you can register the tenant routes for your application.
| These routes are loaded by the TenantRouteServiceProvider.
|
| Feel free to customize them however you want. Good luck!
|
*/

Route::middleware([
    'web',
    InitializeTenancyByDomain::class,
    PreventAccessFromCentralDomains::class,
])->group(function () {

    require __DIR__.'/auth.php';
    Route::post('upload-media', MediaController::class)->middleware('auth:sanctum')->name('upload-media');
    Route::get('/test', [UnitPriceController::class, 'test'])->name('test.test');
    Route::get('/test1', function () {
        $unitPrice = \App\Models\UnitPrice::with('season')->where('id', 12)->get();
        return $unitPrice;
    })->name('test.test1');




    Route::get('/dashboard', [DashboardController::class, 'index'])->middleware(['auth', 'verified'])->name('hotel.dashboard.index');
    //users
    Route::prefix('users')->middleware('auth')->group(function () {
        Route::get('/', [UserController::class, 'index'])->name('hotel.users.index');
        Route::get('/create', [UserController::class, 'create'])->name('hotel.users.create');
        Route::post('/', [UserController::class, 'store'])->name('hotel.users.store');
        //Route::get('/{user}', [UserController::class, 'show'])->name('hotel.users.show');
        Route::get('/{user}/edit', [UserController::class, 'edit'])->name('hotel.users.edit');
        Route::put('/{user}', [UserController::class, 'update'])->name('hotel.users.update');
        Route::delete('/{user}', [UserController::class, 'destroy'])->name('hotel.users.destroy');
    });
    //roles
    Route::prefix('roles')->middleware('auth')->group(function () {
        Route::get('/', [RoleController::class, 'index'])->name('hotel.roles.index');
        Route::get('/create', [RoleController::class, 'create'])->name('hotel.roles.create');
        Route::post('/', [RoleController::class, 'store'])->name('hotel.roles.store');
        //Route::get('/{role}', [RoleController::class, 'show'])->name('hotel.roles.show');
        Route::get('/{role}/edit', [RoleController::class, 'edit'])->name('hotel.roles.edit');
        Route::put('/{role}', [RoleController::class, 'update'])->name('hotel.roles.update');
        Route::delete('/{role}', [RoleController::class, 'destroy'])->name('hotel.roles.destroy');
    });
    //room_floor
    Route::prefix('floors')->middleware('auth')->group(function () {
        Route::get('/', [FloorController::class, 'index'])->name('hotel.floors.index');
        Route::get('/create', [FloorController::class, 'create'])->name('hotel.floors.create');
        Route::post('/', [FloorController::class, 'store'])->name('hotel.floors.store');
        //Route::get('/{floor}', [FloorController::class, 'show'])->name('hotel.floors.show');
        Route::get('/{floor}/edit', [FloorController::class, 'edit'])->name('hotel.floors.edit');
        Route::put('/{floor}', [FloorController::class, 'update'])->name('hotel.floors.update');
        Route::delete('/{floor}', [FloorController::class, 'destroy'])->name('hotel.floors.destroy');
    });

    //bed_types
    Route::prefix('bed_types')->middleware('auth')->group(function () {
        Route::get('/', [bedTypeController::class, 'index'])->name('hotel.bed_types.index');
        Route::get('/create', [bedTypeController::class, 'create'])->name('hotel.bed_types.create');
        Route::post('/', [bedTypeController::class, 'store'])->name('hotel.bed_types.store');
        //Route::get('/{bed_type}', [bedTypeController::class, 'show'])->name('hotel.bed_types.show');
        Route::get('/{bed_type}/edit', [bedTypeController::class, 'edit'])->name('hotel.bed_types.edit');
        Route::put('/{bed_type}', [bedTypeController::class, 'update'])->name('hotel.bed_types.update');
        Route::delete('/{bed_type}', [bedTypeController::class, 'destroy'])->name('hotel.bed_types.destroy');
    });

    //room_type_features
    Route::prefix('room_type_features')->middleware('auth')->group(function () {
        Route::get('/', [RoomTypeFeatureController::class, 'index'])->name('hotel.room_type_features.index');
        Route::post('/', [RoomTypeFeatureController::class, 'store'])->name('hotel.room_type_features.store');
        Route::post('/{room_type_feature}', [RoomTypeFeatureController::class, 'update'])->name('hotel.room_type_features.update');
        Route::post('/{room_type_feature}/destroy', [RoomTypeFeatureController::class, 'destroy'])->name('hotel.room_type_features.destroy');
        Route::post('/{room_type_feature}/restore', [RoomTypeFeatureController::class, 'restore'])->name('hotel.room_type_features.restore');
        Route::delete('/{room_type_feature}', [RoomTypeFeatureController::class, 'forceDelete'])->name('hotel.room_type_features.delete');
    });

    //room_types
    Route::prefix('room_types')->middleware('auth')->group(function () {
        Route::get('/test', [RoomTypeController::class, 'test'])->name('hotel.room_types.test');
        Route::get('/', [RoomTypeController::class, 'index'])->name('hotel.room_types.index');
        Route::get('/create', [RoomTypeController::class, 'create'])->name('hotel.room_types.create');
        Route::post('/', [RoomTypeController::class, 'store'])->middleware('precognitive')->name('hotel.room_types.store');
        Route::post('/{room_type}', [RoomTypeController::class, 'photoAdd'])->name('hotel.room_types.photo_add');
        Route::delete('/{room_type}/photo/{photo_id}/delete', [RoomTypeController::class, 'photoDelete'])->name('hotel.room_types.photo_delete');
        Route::post('/{room_type}/beds/add', [RoomTypeController::class, 'roomTypeBedAdd'])->name
        ('hotel.room_types.bed_add');
        Route::put('/{room_type}/beds/{bed_id}', [RoomTypeController::class, 'roomTypeBedEdit'])->name
        ('hotel.room_types.bed_edit');
        Route::delete('/{room_type}/beds/{bed_id}/delete', [RoomTypeController::class, 'roomTypeBedDelete'])->name
        ('hotel.room_types.bed_delete');
        Route::post('/{room_type}/views/add', [RoomTypeController::class, 'roomTypeViewAdd'])->name
        ('hotel.room_types.view_add');
        Route::delete('/{room_type}/views/{view_id}/delete', [RoomTypeController::class, 'roomTypeViewDelete'])->name
        ('hotel.room_types.view_delete');
        Route::post('/{room_type}/photos', [RoomTypeController::class, 'photosOrdersUpdate'])->name('hotel.room_type_features.photos_orders_update');
        Route::get('/{room_type}/edit', [RoomTypeController::class, 'edit'])->name('hotel.room_types.edit');
        Route::put('/{room_type}', [RoomTypeController::class, 'update'])->name('hotel.room_types.update');
        Route::delete('/{room_type}', [RoomTypeController::class, 'destroy'])->name('hotel.room_types.destroy');
    });
    //room_views
    Route::prefix('room_views')->middleware('auth')->group(function () {
        Route::get('/', [RoomViewController::class, 'index'])->name('hotel.room_views.index');
        Route::get('/create', [RoomViewController::class, 'create'])->name('hotel.room_views.create');
        Route::post('/', [RoomViewController::class, 'store'])->name('hotel.room_views.store');
        //Route::get('/{room_view}', [RoomViewController::class, 'show'])->name('hotel.room_views.show');
        Route::get('/{room_view}/edit', [RoomViewController::class, 'edit'])->name('hotel.room_views.edit');
        Route::put('/{room_view}', [RoomViewController::class, 'update'])->name('hotel.room_views.update');
        Route::delete('/{room_view}', [RoomViewController::class, 'destroy'])->name('hotel.room_views.destroy');
    });
    //rooms
    Route::prefix('rooms')->middleware('auth')->group(function () {
        Route::get('/', [RoomController::class, 'index'])->name('hotel.rooms.index');
        Route::get('/create', [RoomController::class, 'create'])->name('hotel.rooms.create');
        Route::post('/', [RoomController::class, 'store'])->name('hotel.rooms.store');
        //Route::get('/{room}', [RoomController::class, 'show'])->name('hotel.rooms.show');
        Route::get('/{room}/edit', [RoomController::class, 'edit'])->name('hotel.rooms.edit');
        Route::put('/{room}', [RoomController::class, 'update'])->name('hotel.rooms.update');
        Route::delete('/{room}', [RoomController::class, 'destroy'])->name('hotel.rooms.destroy');
    });
    //guests
    Route::prefix('guests')->middleware('auth')->group(function () {
        Route::get('/', [GuestController::class, 'index'])->name('hotel.guests.index');
        Route::get('/create', [GuestController::class, 'create'])->name('hotel.guests.create');
        Route::post('/', [GuestController::class, 'store'])->name('hotel.guests.store');
        //Route::get('/{guest}', [GuestController::class, 'show'])->name('hotel.guests.show');
        Route::get('/{guest}/edit', [GuestController::class, 'edit'])->name('hotel.guests.edit');
        Route::put('/{guest}', [GuestController::class, 'update'])->name('hotel.guests.update');
        Route::delete('/{guest}', [GuestController::class, 'destroy'])->name('hotel.guests.destroy');
    });
    //seasons
    Route::prefix('seasons')->middleware('auth')->group(function () {
        Route::get('/', [SeasonController::class, 'index'])->name('hotel.seasons.index');
        Route::get('/create', [SeasonController::class, 'create'])->name('hotel.seasons.create');
        Route::post('/', [SeasonController::class, 'store'])
            ->middleware('season_request')
            ->name('hotel.seasons.store');
        //Route::get('/{season}', [SeasonController::class, 'show'])->name('hotel.seasons.show');
        Route::get('/{season}/edit', [SeasonController::class, 'edit'])->name('hotel.seasons.edit');
        Route::put('/{season}', [SeasonController::class, 'update'])->name('hotel.seasons.update');
        Route::delete('/{season}', [SeasonController::class, 'destroy'])->name('hotel.seasons.destroy');
    });
    //Pos
    Route::prefix('pos')->middleware('auth')->group(function () {
        Route::get('/', [BookingController::class, 'index'])->name('hotel.pos.index');
    });
    //sales_units
    Route::prefix('sales_units')->middleware('auth')->group(function () {
        Route::get('/', [SalesUnitController::class, 'index'])->name('hotel.sales_units.index');
        Route::get('/create', [SalesUnitController::class, 'create'])->name('hotel.sales_units.create');
        Route::post('/', [SalesUnitController::class, 'store'])->name('hotel.sales_units.store');
        Route::get('/{sales_unit}/edit', [SalesUnitController::class, 'edit'])->name('hotel.sales_units.edit');
        Route::put('/{sales_unit}', [SalesUnitController::class, 'update'])->name('hotel.sales_units.update');
        Route::delete('/{sales_unit}', [SalesUnitController::class, 'destroy'])->name('hotel.sales_units.destroy');
    });
    //products
    Route::prefix('products')->middleware('auth')->group(function () {
        Route::get('/', [ProductsController::class, 'index'])->name('hotel.products.index');
        Route::get('/create', [ProductsController::class, 'create'])->name('hotel.products.create');
        Route::post('/', [ProductsController::class, 'store'])->name('hotel.products.store');
    });
    //bookings
    Route::prefix('bookings')->middleware('auth')->group(function () {
        Route::get('/', [BookingController::class, 'index'])->name('hotel.bookings.index');
        Route::get('/upcomings', [BookingController::class, 'upcoming'])->name('hotel.bookings.upcoming');
        Route::post('/', [BookingController::class, 'store'])->name('hotel.bookings.store');
        Route::get('/{booking}', [BookingController::class, 'show'])->name('hotel.bookings.show');
        Route::get('/{booking}/edit', [BookingController::class, 'edit'])->name('hotel.bookings.edit');
        Route::put('/{booking}', [BookingController::class, 'update'])->name('hotel.bookings.update');
        Route::delete('/{booking}', [BookingController::class, 'destroy'])->name('hotel.bookings.destroy');
    });

    Route::prefix('booking_calendar')->middleware('auth')->group(function () {
        Route::get('/', [BookingController::class, 'calendar'])->name('hotel.booking_calendar');
    });

    Route::prefix('booking_create')->middleware('auth')->group(function () {
        Route::get('/', [BookingController::class, 'create'])
            ->name('hotel.booking_create');
        Route::post('/step/1', [BookingController::class, 'stepOne'])
            ->name('hotel.booking_create.step.one');
        Route::post('/customer_add', [CustomerController::class, 'storeApi'])->name('hotel.bookings.customer_add');
    });

    //booking_rooms
    Route::prefix('booking_rooms')->middleware('auth')->group(function () {
//        Route::get('/', [BookingController::class, 'index'])->name('hotel.booking_rooms.index');
//        Route::get('/create', [BookingController::class, 'create'])->name('hotel.booking_rooms.create');
//        Route::post('/', [BookingController::class, 'store'])->name('hotel.booking_rooms.store');
//        Route::get('/{booking_room}', [BookingController::class, 'show'])->name('hotel.booking_rooms.show');
//        Route::get('/{booking_room}/edit', [BookingController::class, 'edit'])->name('hotel.booking_rooms.edit');
//        Route::put('/{booking_room}', [BookingController::class, 'update'])->name('hotel.booking_rooms.update');
        Route::delete('/{booking_room}', [BookingRoomsController::class, 'destroy'])->name('hotel.booking_rooms.destroy');
    });

    //booking_guests
    Route::prefix('booking_guests')->middleware('auth')->group(function () {
//        Route::get('/', [BookingController::class, 'index'])->name('hotel.booking_guests.index');
//        Route::get('/create', [BookingController::class, 'create'])->name('hotel.booking_guests.create');
//        Route::post('/', [BookingController::class, 'store'])->name('hotel.booking_guests.store');
//        Route::get('/{booking_guest}', [BookingController::class, 'show'])->name('hotel.booking_guests.show');
//        Route::get('/{booking_guest}/edit', [BookingController::class, 'edit'])->name('hotel.booking_guests.edit');
//        Route::put('/{booking_guest}', [BookingController::class, 'update'])->name('hotel.booking_guests.update');
//        Route::delete('/{booking_guest}', [BookingController::class, 'destroy'])->name('hotel.booking_guests.destroy');
        Route::post('/check_out', [BookingGuestsController::class, 'checkOut'])
            ->name('hotel.booking_guests.check_out');
        Route::post('/check_in', [BookingGuestsController::class, 'checkIn'])
            ->name('hotel.booking_guests.check_in');
    });

    //unit_prices
    Route::prefix('unit_prices')->middleware('auth')->group(function () {
        Route::get('/', [UnitPriceController::class, 'index'])->name('hotel.unit_prices.index');
        Route::post('/', [UnitPriceController::class, 'store'])->name('hotel.unit_prices.store');
        Route::get('/{type_has_view}', [UnitPriceController::class, 'show'])->name('hotel.unit_prices.show');
        Route::put('/{unit_price}', [UnitPriceController::class, 'update'])->name('hotel.unit_prices.update');
    });
    //guest_variations
    Route::prefix('variations')->middleware('auth')->group(function () {
        Route::get('/', [GuestVariationMultiplierController::class, 'index'])->name('hotel.variations.index');
        Route::post('/', [GuestVariationMultiplierController::class, 'store'])->name(
            'hotel.variations.store'
        );
        Route::put('/{variation}', [GuestVariationMultiplierController::class, 'update'])->name(
            'hotel.variations.update'
        );
        Route::delete('/{variation}', [GuestVariationMultiplierController::class, 'destroy'])->name(
            'hotel.variations.destroy'
        );
    });
    //settings
    Route::prefix('pricing_policy_settings')->middleware('auth')->group(function () {
        Route::get('/', [PricingPolicySettingsController::class, 'index'])->name('hotel.pricing_policy_settings.index');
        Route::put('/', [PricingPolicySettingsController::class, 'update'])->name('hotel.pricing_policy_settings.update');
    });

    //customers
    Route::prefix('customers')->middleware('auth')->group(function () {
        Route::get('/', [CustomerController::class, 'index'])->name('hotel.customers.index');
        Route::get('/create', [CustomerController::class, 'create'])->name('hotel.customers.create');
        Route::post('/', [CustomerController::class, 'store'])->name('hotel.customers.store');
        Route::get('/search/{query}', [CustomerController::class, 'search'])->name('hotel.customers.search');
        Route::get('/{customer}', [CustomerController::class, 'show'])->name('hotel.customers.show');
        Route::get('/{customer}/transactions', [CustomerController::class, 'transactions'])->name('hotel.customers.transactions');
        Route::get('/{customer}/get', [CustomerController::class, 'get'])->name('hotel.customers.get');
        Route::get('/{customer}/edit', [CustomerController::class, 'edit'])->name('hotel.customers.edit');
        Route::put('/{customer}', [CustomerController::class, 'update'])->name('hotel.customers.update');
        Route::delete('/{customer}', [CustomerController::class, 'destroy'])->name('hotel.customers.destroy');
    });

    //customer_payments
    Route::prefix('customer_payments')->middleware('auth')->group(function () {
        /*Route::get('/', [CustomerController::class, 'index'])->name('hotel.customer_payments.index');
        Route::get('/create', [CustomerController::class, 'create'])->name('hotel.customer_payments.create');*/
        Route::post('/', [BookingPaymentsController::class, 'store'])
            ->middleware('customer_payment_request')
            ->name('hotel.customer_payments.store');
        /*	Route::get('/{customer_payment}', [CustomerController::class, 'show'])->name('hotel.customer_payments.show');
            Route::get('/{customer_payment}/edit', [CustomerController::class, 'edit'])->name('hotel.customer_payments.edit');
            Route::put('/{customer_payment}', [CustomerController::class, 'update'])->name('hotel.customer_payments.update');
            Route::delete('/{customer_payment}', [CustomerController::class, 'destroy'])->name('hotel.customer_payments.destroy');*/
    });

    //case_and_banks
    Route::prefix('case_and_banks')->middleware('auth')->group(function () {
        Route::get('/', [CaseAndBanksController::class, 'index'])->name('hotel.case_and_banks.index');
        Route::get('/create', [CaseAndBanksController::class, 'create'])->name('hotel.case_and_banks.create');
        Route::post('/', [CaseAndBanksController::class, 'store'])->name('hotel.case_and_banks.store');
        //Route::get('/{case_and_banks}', [CaseAndBanksController::class, 'show'])->name('hotel.guests.show');
        Route::get('/{case_and_banks}/edit', [CaseAndBanksController::class, 'edit'])->name('hotel.case_and_banks.edit');
        Route::put('/{case_and_banks}', [CaseAndBanksController::class, 'update'])->name('hotel.case_and_banks.update');
        Route::delete('/{case_and_banks}', [CaseAndBanksController::class, 'destroy'])->name('hotel.case_and_banks.destroy');
    });

    //hotelrunner
    Route::prefix('channel_managers')->middleware('auth')->group(function () {
//        Route::get('/', function () {
//            $hotelRunner = new \App\Helpers\HotelRunnerApi('VX-KhEctGz9y_wQbgdqaVLrkUcPFH55m8bwlNFFX', '810878391');
//            return $hotelRunner->getRooms();
//        })->name('hotel.channel_managers.index');

        Route::get('/hotelrunner', [HotelRunnerController::class, 'api'])->name('hotel.channel_managers.hotelrunner');
//        Route::get('/hotelrunner', [ChannelManagerController::class, 'index'])->name('hotel.channel_managers.hotelrunner.index');
//        Route::get('/create', [ChannelManagerController::class, 'create'])->name('hotel.channel_managers.create');
    });
});

