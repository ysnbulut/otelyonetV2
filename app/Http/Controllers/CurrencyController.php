<?php

namespace App\Http\Controllers;

use App\Settings\GeneralSettings;
use Illuminate\Http\Request;
use Teknomavi\Tcmb\Doviz;

class CurrencyController extends Controller
{
    public function exchange(Request $request)
    {
//        $settings = new GeneralSettings();
//        if ($settings->pricing_currency !== 'TRY') {
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
