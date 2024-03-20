<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\LaravelSettings\Migrations\SettingsMigrator;

class TenantHotelSettingsSeeder extends Seeder
{
    protected SettingsMigrator $migrator;

    public function __construct()
    {
        $this->migrator = app(SettingsMigrator::class);
    }
    public function run(): void
    {
        //Selectbox olmalı...
        $channelManagers = [['label' => 'HotelRunner', 'value' => 'hotelrunner']];
        //Selectbox olmalı...
        $channelManager = ['label' => 'Kanal Yöneticisi', 'description' => 'Otelin kullanacağı kanal yöneticisini belirler Örn: HotelRunner, SiteMinder, Reseliva, Cloudbeds gibi...', 'name' => 'channel_manager', 'type' => 'select', //text, number, select, boolean
            'options' => $channelManagers, 'value' => 'closed'];
        //Selectbox olmalı...

        $this->migrator->add('hotel.channel_manager', $channelManager);
        $this->migrator->add('hotel.api_settings', []);
    }
}
