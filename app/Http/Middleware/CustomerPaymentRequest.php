<?php

namespace App\Http\Middleware;

use App\Settings\GeneralSettings;
use Carbon\Carbon;
use Closure;
use Illuminate\Http\Request;
use Teknomavi\Tcmb\Doviz;

class CustomerPaymentRequest
{
 public function handle(Request $request, Closure $next)
 {
  if ($request->isMethod('post')) {
   if ($request->routeIs('customer_payments.store')) {
    $payment_date = Carbon::createFromFormat('d.m.Y', $request->payment_date)->format('Y-m-d');
    unset($request['payment_date']);
    $currency_amount = $this->getCleanAmount($request->currency_amount);
    unset($request['currency_amount']);
    $settings = new GeneralSettings();
    if ($settings->pricing_currency !== 'TRY') {
     if ($request->currency !== 'TRY') {
      if ($request->currency_amount > 0) {
       $doviz = new Doviz();
       $kur = $doviz->kurAlis($request->currency, Doviz::TYPE_EFEKTIFALIS);
       $amount_paid = round($currency_amount * $kur, 2);
      } else {
       $amount_paid = $currency_amount;
      }
     } else {
      $amount_paid = $currency_amount;
     }
    } else {
     $amount_paid = $currency_amount;
    }
    $request->merge([
     'payment_date' => $payment_date,
     'currency_amount' => $currency_amount,
     'amount_paid' => $amount_paid,
    ]);
   }
  }
  return $next($request);
 }

 protected function getCleanAmount($amount): float
 {
  return (float) trim(
   str_replace(
    [' TRY', ' USD', ' EUR', ' GBP', ' SAR', ' AUD', ' CHF', ' CAD', ' KWD', ' JPY', ' DKK', ' SEK', ' NOK'],
    '',
    str_replace(',', '', trim($amount))
   )
  );
 }
}
