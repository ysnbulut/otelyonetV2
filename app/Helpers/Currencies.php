<?php

namespace App\Helpers;

use JsonException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Teknomavi\Tcmb\Exception\UnknownCurrencyCode;
use Teknomavi\Tcmb\Exception\UnknownPriceType;

class Currencies
{
    public string $homeCurrency = 'TRY';
    private string $cacheKey = 'currency_rates';
    private int $cacheTime = 300; // Cache for 2 minutes


//    public function __construct()
//    {
//
//    }

    /**
     * @throws JsonException
     */
    public function convert(string $formCurrency, string $toCurrency, float|int $amount): ?array
    {
        $formCurrency = mb_strtolower($formCurrency);
        $toCurrency = mb_strtolower($toCurrency);

        if ($formCurrency === $toCurrency) {
            return [
                'status' => true,
                'from_currency' => $formCurrency,
                'from_currency_name' => $this->currencies[$formCurrency] ?? null,
                'to_currency' => $toCurrency,
                'to_currency_name' => $this->currencies[$toCurrency] ?? null,
                'amount' => $amount,
                'exchange_rate' => 1,
                'total' => $amount,
            ];
        }

        $cachedData = Cache::get($this->cacheKey . '_' . $formCurrency);
        if ($cachedData) {
            $fetchCurrencyRates = $cachedData;
        } else {
            try {
                $response = Http::get(sprintf('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/%s.json', $formCurrency));
                if ($response->successful()) {
                    $fetchCurrencyRates = $response->body();
                    Cache::put($this->cacheKey . '_' . $formCurrency, $fetchCurrencyRates, now()->addSeconds($this->cacheTime));
                } else {
                    return [
                        'status' => false,
                        'from_currency' => $formCurrency,
                        'from_currency_name' => null,
                        'to_currency' => $toCurrency,
                        'to_currency_name' => null,
                        'amount' => $amount,
                        'error' => 'API call failed',
                        'error_message' => $response->body(),
                    ];
                }
            } catch (\Exception $e) {
                return [
                    'status' => false,
                    'from_currency' => $formCurrency,
                    'from_currency_name' => null,
                    'to_currency' => $toCurrency,
                    'to_currency_name' => null,
                    'amount' => $amount,
                    'error' => 'Unknown from currency code',
                    'error_message' => $e->getMessage(),
                ];
            }
        }

        $currencyApi = collect(json_decode($fetchCurrencyRates, false, 512, JSON_THROW_ON_ERROR))->get($formCurrency);
        if (!$currencyApi) {
            return [
                'status' => false,
                'from_currency' => $formCurrency,
                'from_currency_name' => null,
                'to_currency' => $toCurrency,
                'to_currency_name' => null,
                'amount' => $amount,
                'error' => 'Unknown from currency code',
                'error_message' => 'Unknown from currency code ',
            ];
        }
        $currencyApi = (array)$currencyApi;
        if (array_key_exists($toCurrency, $currencyApi)) {
            $currencyRate = $currencyApi[$toCurrency];
        } else {
            return [
                'status' => false,
                'from_currency' => $formCurrency,
                'from_currency_name' => null,
                'to_currency' => $toCurrency,
                'to_currency_name' => null,
                'amount' => $amount,
                'error' => 'Unknown to currency code',
                'error_message' => 'Unknown to currency code ',
            ];
        }
        $total = round($amount * $currencyRate, 2);
        return [
            'status' => true,
            'from_currency' => $formCurrency,
            'from_currency_name' => $formCurrency,
            'to_currency' => $toCurrency,
            'to_currency_name' => $toCurrency,
            'amount' => $amount,
            'exchange_rate' => $currencyRate,
            'total' => $total,
        ];
    }

}