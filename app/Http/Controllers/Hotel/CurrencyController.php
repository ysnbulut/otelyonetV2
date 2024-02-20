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

    public function convert(Request $request)
    {
        if ($request->currency !== 'TRY') {
            if ($request->amount > 0) {
                $doviz = new Doviz();
                $kur = $doviz->kurAlis($request->currency, Doviz::TYPE_EFEKTIFALIS);
                return round($request->amount / $kur, 2);
            } else {
                return $request->amount;
            }
        } else {
            return $request->amount;
        }
    }

    public function amountConvert(Request $request) {
        return [
            'amount' => $this->convert($request)
        ];
    }
}
