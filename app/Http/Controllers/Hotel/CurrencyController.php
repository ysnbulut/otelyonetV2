<?php

namespace App\Http\Controllers\Hotel;

use App\Http\Controllers\Controller;
use App\Settings\PricingPolicySettings;
use Illuminate\Http\Request;
use Teknomavi\Tcmb\Doviz;

class CurrencyController extends Controller
{

    protected PricingPolicySettings $settings;

    public function __construct()
    {
        $this->settings = new PricingPolicySettings();
    }

    public function exchange(Request $request)
    {
//        if ($this->settings->pricing_currency['value'] !== 'TRY') {
//            return $this->convert($request);
//        } else {
//            return $request->amount;
//        }
    }

    public function convert(Request $request): ?array
    {
        if ($request->currency !== 'TRY') {
            $doviz = new Doviz();
            $kur = $doviz->kurAlis($request->currency, Doviz::TYPE_EFEKTIFALIS);
            if ($request->amount > 0) {
                return [
                    'currency' => $request->currency,
                    'amount' => $request->amount,
                    'exchange_rate' => $kur,
                    'total' => round($request->amount / $kur, 2),
                ];
            } else {
                return [
                    'currency' => $request->currency,
                    'amount' => 0,
                    'exchange_rate' => $kur,
                    'total' => 0,
                ];
            }
        } else {
            return [
                'currency' => $request->currency,
                'amount' => $request->amount,
                'exchange_rate' => 1,
                'total' => round($request->amount, 2),
            ];
        }
    }

    public function amountConvert(Request $request)
    {
        return $this->convert($request);
    }
}
