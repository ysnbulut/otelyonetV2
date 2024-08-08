<?php

namespace App\Settings;

use Spatie\LaravelSettings\Settings;
class HotelSettings extends Settings
{
    public array $channel_manager;
    public array $api_settings;

    public array $kbs;
    public static function group(): string
    {
        return 'hotel';
    }
}