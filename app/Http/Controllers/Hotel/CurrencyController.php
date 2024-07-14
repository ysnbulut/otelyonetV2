<?php

namespace App\Http\Controllers\Hotel;

use App\Helpers\Currencies;
use App\Http\Controllers\Controller;
use App\Settings\PricingPolicySettings;
use Illuminate\Http\Request;
use JsonException;
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

    /**
     * @throws JsonException
     */
    public function convert(Request $request): ?array
    {
        $currencies = (new Currencies())->convert($request->currency, 'TRY', $request->amount);
        if ($currencies['status'] === false) {
            return [
                'currency' => $request->currency,
                'amount' => $request->amount,
                'exchange_rate' => 1,
                'total' => round($request->amount, 2),
            ];
        }
        return [
            'currency' => $request->currency,
            'amount' => $request->amount,
            'exchange_rate' => 1,
            'total' => round($currencies['total'], 2),
        ];
    }

    /**
     * @throws JsonException
     */
    public function amountConvert(Request $request): ?array
    {
        return $this->convert($request);
    }
}
