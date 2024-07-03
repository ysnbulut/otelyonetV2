<?php

namespace App\Helpers;

use GuzzleHttp\Client;
use JsonException;
use Teknomavi\Tcmb\Doviz;
use Teknomavi\Tcmb\Exception\UnknownCurrencyCode;
use Teknomavi\Tcmb\Exception\UnknownPriceType;
use Illuminate\Support\Facades\Cache;

class Currencies extends Doviz
{
    public string $homeCurrency = 'TRY';

    public array $currencies = [
        'USD' => 'ABD DOLARI',
        'AUD' => 'AVUSTRALYA DOLARI',
        'DKK' => 'DANİMARKA KRONU',
        'EUR' => 'EURO',
        'GBP' => 'İNGİLİZ STERLİNİ',
        'CHF' => 'İSVİÇRE FRANGI',
        'SEK' => 'İSVEÇ KRONU',
        'CAD' => 'KANADA DOLARI',
        'KWD' => 'KUVEYT DİNARI',
        'NOK' => 'NORVEÇ KRONU',
        'SAR' => 'SUUDİ ARABİSTAN RİYALİ',
        'JPY' => 'JAPON YENİ',
        'BGN' => 'BULGAR LEVASI',
        'RON' => 'RUMEN LEYİ',
        'RUB' => 'RUS RUBLESİ',
        'IRR' => 'İRAN RİYALİ',
        'CNY' => 'ÇİN YUANI',
        'PKR' => 'PAKİSTAN RUPİSİ',
        'QAR' => 'KATAR RİYALİ',
        'KRW' => 'GÜNEY KORE WONU',
        'AZN' => 'AZERBAYCAN MANATI',
        'AED' => 'BİRLEŞİK ARAP EMİRLİKLERİ DİRAMI',
    ];

    public array $effectiveCurrencies = [
        'USD' => true,
        'AUD' => true,
        'DKK' => true,
        'EUR' => true,
        'GBP' => true,
        'CHF' => true,
        'SEK' => true,
        'CAD' => true,
        'KWD' => true,
        'NOK' => true,
        'SAR' => true,
        'JPY' => true,
        'BGN' => false,
        'RON' => false,
        'RUB' => false,
        'IRR' => false,
        'CNY' => false,
        'PKR' => false,
        'QAR' => false,
        'KRW' => false,
        'AZN' => false,
        'AED' => false
    ];

    public function __construct()
    {
        parent::__construct();
    }

    /**
     * @throws UnknownPriceType
     * @throws JsonException
     */
    public function convert(string $formCurrency, string $toCurrency, float|int $amount): ?array
    {
        $formCurrency = mb_strtoupper($formCurrency);
        $toCurrency = mb_strtoupper($toCurrency);
        $rateType = Doviz::TYPE_SATIS;
        if ($formCurrency === $toCurrency) {
            return [
                'status' => true,
                'type' => $rateType,
                'from_currency' => $formCurrency,
                'from_currency_name' => $this->currencies[$formCurrency] ?? null,
                'to_currency' => $toCurrency,
                'to_currency_name' => $this->currencies[$toCurrency] ?? null,
                'amount' => $amount,
                'exchange_rate' => 1,
                'total' => $amount,
            ];
        }

        if (!isset($this->currencies[$formCurrency], $this->currencies[$toCurrency])) {
            try {
                $fetchCurrencyRates = file_get_contents(sprintf('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/%s.json', mb_strtolower($formCurrency)));
            } catch (\Exception $e) {
                return [
                    'status' => false,
                    'type' => 'CRA_' . $rateType,
                    'from_currency' => $formCurrency,
                    'from_currency_name' => null,
                    'to_currency' => $toCurrency,
                    'to_currency_name' => null,
                    'amount' => $amount,
                    'error' => 'Unknown from currency code',
                    'error_message' => $e->getMessage(),
                ];
            }
            $currencyApi = collect(json_decode($fetchCurrencyRates, false, 512, JSON_THROW_ON_ERROR))->get(mb_strtolower($formCurrency));
            if (!$currencyApi) {
                return [
                    'status' => false,
                    'type' => 'CRA_' . $rateType,
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
            if (array_key_exists(mb_strtolower($toCurrency), $currencyApi)) {
                $currencyRate = $currencyApi[mb_strtolower($toCurrency)];
            } else {
                return [
                    'status' => false,
                    'type' => 'CRA_' . $rateType,
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
                'type' => 'CRA_' . $rateType,
                'from_currency' => $formCurrency,
                'from_currency_name' => $formCurrency,
                'to_currency' => $toCurrency,
                'to_currency_name' => $toCurrency,
                'amount' => $amount,
                'exchange_rate' => $currencyRate,
                'total' => $total,
            ];
        }

        $rateType = $this->effectiveCurrencies[$formCurrency] && $this->effectiveCurrencies[$toCurrency] ? Doviz::TYPE_EFEKTIFSATIS : Doviz::TYPE_SATIS;

        if ($formCurrency !== $this->homeCurrency) {
            try {
                $rateFrom = $this->getCurrencyExchangeRate($formCurrency, $rateType);
            } catch (UnknownCurrencyCode $e) {
                return [
                    'status' => false,
                    'type' => $rateType,
                    'from_currency' => $formCurrency,
                    'from_currency_name' => $this->currencies[$formCurrency],
                    'to_currency' => $toCurrency,
                    'to_currency_name' => $this->currencies[$toCurrency],
                    'amount' => $amount,
                    'error' => 'Unknown from currency code',
                    'error_message' => $e->getMessage(),
                ];
            }
        } else {
            $rateFrom = 1;
        }
        if ($toCurrency !== $this->homeCurrency) {
            try {
                $rateTo = $this->getCurrencyExchangeRate($toCurrency, $rateType);
            } catch (UnknownCurrencyCode $e) {
                return [
                    'status' => false,
                    'type' => $rateType,
                    'from_currency' => $formCurrency,
                    'from_currency_name' => $this->currencies[$formCurrency],
                    'to_currency' => $toCurrency,
                    'to_currency_name' => $this->currencies[$toCurrency],
                    'amount' => $amount,
                    'error' => 'Unknown to currency code',
                    'error_message' => $e->getMessage(),
                ];
            }
        } else {
            $rateTo = 1;
        }

        $total = round($amount * $rateFrom / $rateTo, 2);
        return [
            'status' => true,
            'type' => 'MB_' . $rateType,
            'from_currency' => $formCurrency,
            'from_currency_name' => $this->currencies[$formCurrency],
            'to_currency' => $toCurrency,
            'to_currency_name' => $this->currencies[$toCurrency],
            'amount' => $amount,
            'exchange_rate' => $rateFrom / $rateTo,
            'total' => $total,
        ];


    }

}