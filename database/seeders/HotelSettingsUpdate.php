<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Province;
use App\Models\District;
use App\Helpers\NviClass;
use Spatie\LaravelSettings\Migrations\SettingsMigrator;

class HotelSettingsUpdate extends Seeder
{
    public function run(): void
    {
        $migrator = app(SettingsMigrator::class);
        $defaultHotelSettings = json_decode(file_get_contents(base_path('database/data/defaultHotelSettings.json')), true);
        $migrator->add('hotel.kbs', $defaultHotelSettings['kbs']);
        $migrator->add('hotel.kbs_settings', $defaultHotelSettings['kbs_settings']);
    }
}
