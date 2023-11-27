<?php

declare(strict_types=1);

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\BedTypeController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\CaseAndBanksController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\CustomerPaymentsController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FloorController;
use App\Http\Controllers\GeneralSettingsController;
use App\Http\Controllers\GuestController;
use App\Http\Controllers\PossibilitiesMultiplierController;
use App\Http\Controllers\PossibilitiesOfGuestsRoomTypeController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\RoomTypeController;
use App\Http\Controllers\RoomTypeFeatureController;
use App\Http\Controllers\RoomViewController;
use App\Http\Controllers\SeasonController;
use App\Http\Controllers\UnitPriceRoomTypeAndViewController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Stancl\Tenancy\Middleware\InitializeTenancyByDomain;
use Stancl\Tenancy\Middleware\PreventAccessFromCentralDomains;
use Illuminate\Foundation\Application;


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
        Route::get('/create', [RoomTypeFeatureController::class, 'create'])->name('hotel.room_type_features.create');
        Route::post('/', [RoomTypeFeatureController::class, 'store'])->name('hotel.room_type_features.store');
        //Route::get('/{room_type_feature}', [RoomTypeFeatureController::class, 'show'])->name('hotel.room_type_features.show');
        Route::get('/{room_type_feature}/edit', [RoomTypeFeatureController::class, 'edit'])->name('hotel.room_type_features.edit');
        Route::put('/{room_type_feature}', [RoomTypeFeatureController::class, 'update'])->name('hotel.room_type_features.update');
        Route::delete('/{room_type_feature}', [RoomTypeFeatureController::class, 'destroy'])->name('hotel.room_type_features.destroy');
    });
    //room_types
    Route::prefix('room_types')->middleware('auth')->group(function () {
        Route::get('/', [RoomTypeController::class, 'index'])->name('hotel.room_types.index');
        Route::get('/create', [RoomTypeController::class, 'create'])->name('hotel.room_types.create');
        Route::post('/', [RoomTypeController::class, 'store'])->name('hotel.room_types.store');
        //Route::get('/{room_type}', [RoomTypeController::class, 'show'])->name('hotel.room_types.show');
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
    //bookings
    Route::prefix('bookings')->middleware('auth')->group(function () {
        Route::get('/', [BookingController::class, 'index'])->name('hotel.bookings.index');
        Route::get('/calendar', [BookingController::class, 'calendar'])->name('hotel.bookings.calendar');
        Route::get('/upcomings', [BookingController::class, 'upcoming'])->name('hotel.bookings.upcoming');

        Route::get('/create', [BookingController::class, 'create'])
            ->middleware('booking_request')
            ->name('hotel.bookings.create');

        Route::get('/create/step/1')
            ->middleware('booking_request')
            ->name('hotel.bookings.create.step.one');

        Route::get('/create/single/step/1', [BookingController::class, 'createSingleStepOne'])
            ->middleware('booking_request')
            ->name('hotel.bookings.create.single.step.one');
        Route::get('/create/group/step/1', [BookingController::class, 'createGroupStepOne'])
            ->middleware('booking_request')
            ->name('hotel.bookings.create.group.step.one');
        Route::get('/create/single/step/2', [BookingController::class, 'createStepTwoCreate'])
            ->middleware('booking_request')
            ->name('hotel.bookings.create.single.step.two');
        Route::get('/create/single/step/2', [BookingController::class, 'createStepTwoCreate'])
            ->middleware('booking_request')
            ->name('hotel.bookings.create.group.step.two');
        Route::get('/create/step/3', [BookingController::class, 'createStepThreeCreate'])
            ->middleware('booking_request')
            ->name('hotel.bookings.create.single.step.three.create');
        Route::post('/create/step/3', [BookingController::class, 'createStepThreeStore'])
            ->middleware('booking_request')
            ->name('hotel.bookings.create.single.step.three.store');
        Route::get('/create/step/4', [BookingController::class, 'createStepFourCreate'])
            ->middleware('booking_request')
            ->name('hotel.bookings.create.single.step.four.create');
        Route::post('/create/step/4', [BookingController::class, 'createStepFourStore'])
            ->middleware('booking_request')
            ->name('hotel.bookings.create.single.step.four.store');
        Route::get('/create/step/5', [BookingController::class, 'createStepFiveCreate'])
            ->middleware('booking_request')
            ->name('hotel.bookings.create.single.step.five.create');
        Route::post('/create/step/5', [BookingController::class, 'createStepFiveStore'])
            ->middleware('booking_request')
            ->name('hotel.bookings.create.single.step.five.store');
        Route::post('/', [BookingController::class, 'store'])->name('hotel.bookings.store');
        Route::get('/{booking}', [BookingController::class, 'show'])->name('hotel.bookings.show');
        Route::get('/{booking}/edit', [BookingController::class, 'edit'])->name('hotel.bookings.edit');
        Route::put('/{booking}', [BookingController::class, 'update'])->name('hotel.bookings.update');
        Route::delete('/{booking}', [BookingController::class, 'destroy'])->name('hotel.bookings.destroy');
    });

    //unit_prices
    Route::prefix('unit_prices')->middleware('auth')->group(function () {
        Route::get('/', [UnitPriceRoomTypeAndViewController::class, 'index'])->name('hotel.unit_prices.index');
        //Route::post('/create', [UnitPriceRoomTypeAndViewController::class, 'create'])->name('hotel.unit_prices.create');
        Route::post('/', [UnitPriceRoomTypeAndViewController::class, 'store'])->name('hotel.unit_prices.store');
        Route::get('/{type_has_view}', [UnitPriceRoomTypeAndViewController::class, 'show'])->name('hotel.unit_prices.show');
        //Route::get('/{type_has_view}/edit', [UnitPriceRoomTypeAndViewController::class, 'edit'])->name('hotel.unit_prices.edit');
        Route::put('/{unit_price}', [UnitPriceRoomTypeAndViewController::class, 'update'])->name('hotel.unit_prices.update');
        //Route::delete('/{unit_price}', [UnitPriceRoomTypeAndViewController::class, 'destroy'])->name('hotel.unit_prices.destroy');
    });
    //possibilities_of_guests
    Route::prefix('possibilities_of_guests')->middleware('auth')->group(function () {
        Route::get('/', [PossibilitiesOfGuestsRoomTypeController::class, 'index'])->name('hotel.possibilities_of_guests.index');
        Route::get('/{room_type}/create', [PossibilitiesOfGuestsRoomTypeController::class, 'create'])->name(
            'hotel.possibilities_of_guests.create'
        );
        Route::post('/{room_type}', [PossibilitiesOfGuestsRoomTypeController::class, 'store'])->name(
            'hotel.possibilities_of_guests.store'
        );
        Route::get('/{room_type}', [PossibilitiesOfGuestsRoomTypeController::class, 'show'])->name(
            'hotel.possibilities_of_guests.show'
        );
        Route::get('/{room_type}/edit', [PossibilitiesOfGuestsRoomTypeController::class, 'edit'])->name(
            'hotel.possibilities_of_guests.edit'
        );
        Route::put('/{possibilities_of_guest}', [PossibilitiesOfGuestsRoomTypeController::class, 'update'])->name(
            'hotel.possibilities_of_guests.update'
        );
        Route::delete('/{possibilities_of_guest}', [PossibilitiesOfGuestsRoomTypeController::class, 'destroy'])->name(
            'hotel.possibilities_of_guests.destroy'
        );
    });
    //possibilities_multipliers
    Route::prefix('possibilities_multipliers')->middleware('auth')->group(function () {
        Route::get('/', [PossibilitiesMultiplierController::class, 'index'])->name('hotel.possibilities_multipliers.index');
        //Route::get('/{room_type}/create', [PossibilitiesMultiplierController::class, 'create'])->name(
        // 'hotel.possibilities_multipliers.create'
        //);
        Route::post('/', [PossibilitiesMultiplierController::class, 'store'])->name('hotel.possibilities_multipliers.store');
        Route::get('/{room_type}', [PossibilitiesMultiplierController::class, 'show'])->name(
            'hotel.possibilities_multipliers.show'
        );
        //Route::get('/{room_type}/edit', [PossibilitiesMultiplierController::class, 'edit'])->name(
        // 'hotel.possibilities_multipliers.edit'
        //);
        Route::put('/{possibilities_multiplier}', [PossibilitiesMultiplierController::class, 'update'])->name(
            'hotel.possibilities_multipliers.update'
        );
        //Route::delete('/{unit_price}', [PossibilitiesMultiplierController::class, 'destroy'])->name(
        // 'hotel.possibilities_multipliers.destroy'
        //);
    });
    //settings
    Route::prefix('settings')->middleware('auth')->group(function () {
        Route::get('/', [GeneralSettingsController::class, 'index'])->name('hotel.settings.index');
        Route::put('/', [GeneralSettingsController::class, 'update'])->name('hotel.settings.update');
    });

    //customers
    Route::prefix('customers')->middleware('auth')->group(function () {
        Route::get('/', [CustomerController::class, 'index'])->name('hotel.customers.index');
        Route::get('/create', [CustomerController::class, 'create'])->name('hotel.customers.create');
        Route::post('/', [CustomerController::class, 'store'])->name('hotel.customers.store');
        Route::get('/search/{query}', [CustomerController::class, 'search'])->name('hotel.customers.search');
        Route::get('/{customer}', [CustomerController::class, 'show'])->name('hotel.customers.show');
        Route::get('/{customer}/get', [CustomerController::class, 'get'])->name('hotel.customers.get');
        Route::get('/{customer}/edit', [CustomerController::class, 'edit'])->name('hotel.customers.edit');
        Route::put('/{customer}', [CustomerController::class, 'update'])->name('hotel.customers.update');
        Route::delete('/{customer}', [CustomerController::class, 'destroy'])->name('hotel.customers.destroy');
    });

    //customer_payments
    Route::prefix('customer_payments')->middleware('auth')->group(function () {
        /*Route::get('/', [CustomerController::class, 'index'])->name('hotel.customer_payments.index');
        Route::get('/create', [CustomerController::class, 'create'])->name('hotel.customer_payments.create');*/
        Route::post('/', [CustomerPaymentsController::class, 'store'])
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
});

