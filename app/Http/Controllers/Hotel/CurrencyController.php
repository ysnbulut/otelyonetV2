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

    /**
     * @throws JsonException
     */
    public function convert(Request $request)
    {
        $currencies = (new Currencies())->convert('TRY', $request->currency, $request->amount);
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
            'amount' => $currencies['amount'],
            'exchange_rate' => $currencies['exchange_rate'],
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
