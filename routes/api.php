<?php

use App\Http\Controllers\BookingWebhookController;
use App\Http\Controllers\Hotel\CurrencyController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Stancl\Tenancy\Middleware\InitializeTenancyByDomain;
use Stancl\Tenancy\Middleware\PreventAccessFromCentralDomains;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/


Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


//Route::middleware(['api'])->post('/currency/exchange', [CurrencyController::class, 'exchange'])->name('mb.currency.exchange');

Route::middleware(['api'])->post('/exchange/amount', [CurrencyController::class, 'amountConvert'])->name('amount.exchange');

Route::middleware(['api'])->post('/{tenant}/webhook/booking', [BookingWebhookController::class, 'handleWebhook'])->name
('booking.webhook');
