<?php

return [
    /*
     |--------------------------------------------------------------------------
     | Laravel money
     |--------------------------------------------------------------------------
     */
    'locale' => config('app.locale', 'tr_TR'),
    'defaultCurrency' => config('app.currency', 'TRY'),
    'defaultFormatter' => null,
    'defaultSerializer' => null,
    'isoCurrenciesPath' => __DIR__.'/../vendor/moneyphp/money/resources/currency.php',
    'currencies' => [
        'iso' => [
            'TRY',
            'USD',
            'EUR',
            'GBP',
            'SAR',
            'AUD',
            'CHF',
            'CAD',
            'KWD',
            'JPY',
            'DKK',
            'SEK',
            'NOK',
        ],
        'bitcoin' => 'all',
        'custom' => [
            // 'MY1' => 2,
            // 'MY2' => 3
        ],
    ],
];
