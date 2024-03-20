<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\HotelController;
use App\Models\BedType;
use App\Models\Tenant;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
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

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('admin.dashboard.index');

    Route::prefix('/hotels')->group(function () {
        Route::get('/', [HotelController::class, 'index'])->name('admin.hotels.index');
        Route::get('/create', [HotelController::class, 'create'])->name('admin.hotels.create');
        Route::get('/{hotel}', [HotelController::class, 'show'])->name('admin.hotels.show');
        Route::post('/', [HotelController::class, 'store'])->name('admin.hotels.store');
        Route::put('/{hotel}/channel_manager', [HotelController::class, 'channel_manager'])->name('admin.hotels.channe_manager');
        Route::get('/test', function () {
            $tenant = Tenant::find('5304c071-ff04-49d4-b701-d2c0fab2f5db');
            $tenant->run(function () {
                Artisan::call('db:seed', ['--class' => 'DatabaseSeeder']);
                Artisan::call('db:seed', ['--class' => 'TenantChannelManagerSeeder']);
                Artisan::call('db:seed', ['--class' => 'TenantCitizenSeeder']);
                Artisan::call('db:seed', ['--class' => 'TenantPricingPolicySettingsSeeder']);
            });
        })->name('admin.test');
    });
//    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
//    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
//    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
