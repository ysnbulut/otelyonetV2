<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\HotelController;
use App\Http\Controllers\Site\IndexController;
use App\Http\Controllers\SyncController;
use App\Models\BookingRoom;
use App\Models\Tenant;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;

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
Route::get('/', [IndexController::class, 'index'])->name('site.index');

Route::get('/blabla', function () {
    Tenant::all()->each(function ($tenant) use (&$response) {
        $tenant->run(function () {
            BookingRoom::with('booking_guests')->whereDate('check_out', '<=', Carbon::now()->subDay()->format('Y-m-d H:i:s'))->whereHas('booking_guests', static function ($query) {
                $query->where('check_in', false)->orWhere('check_out', false)->orWhere('check_in_kbs', false)->orWhere('check_out_kbs', false);
            })->get()->map(static function ($bookingRoom) {
                $bookingRoom->booking_guests->each(static function ($bookingGuest) use ($bookingRoom) {
                    if ($bookingGuest->check_in === false) {
                        $bookingGuest->update(['check_in_date' => $bookingRoom->check_in, 'check_in' => true]);
                    }
                    if ($bookingGuest->check_out === false) {
                        $bookingGuest->update(['check_out_date' => $bookingRoom->check_out, 'check_out' => true]);
                    }
                    if ($bookingGuest->check_in_kbs === false) {
                        $bookingGuest->update(['check_in_kbs' => true]);
                    }
                    if ($bookingGuest->check_out_kbs === false) {
                        $bookingGuest->update(['check_out_kbs' => true]);
                    }
                    $bookingGuest->update(['status' => 'check_out']);
                });
            });
        });
        DB::disconnect($tenant->tenancy_db_name);
        DB::disconnect('tenant');
        $tenant->getConnection()->disconnect();
    });
});

Route::get('/syncwebhookerrors', [SyncController::class, 'index'])->name('test.index');

require __DIR__ . '/auth.php';
