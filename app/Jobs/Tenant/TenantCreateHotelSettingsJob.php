<?php

namespace App\Jobs\Tenant;

use App\Models\Tenant;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Spatie\LaravelSettings\Exceptions\SettingAlreadyExists;
use Spatie\LaravelSettings\Migrations\SettingsMigrator;

class TenantCreateHotelSettingsJob implements ShouldQueue, ShouldBeUnique
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public int $maxException = 3;

    public int $timeout = 600;

    public int $backoff = 300;

    public Tenant $tenant;

    public int $uniqueFor = 900;

    public function __construct(Tenant $tenant)
    {
        $this->tenant = $tenant;

    }

    public function uniqueId(): string
    {
        return $this->tenant->id;
    }

    public function handle(): void
    {
        $migrator = app(SettingsMigrator::class);
        $this->tenant->run(/**
         * @throws SettingAlreadyExists
         */ function () use ($migrator) {
            $defaultHotelSettings = json_decode(file_get_contents(base_path('database/data/defaultHotelSettings.json')), true);
            $migrator->add('hotel.channel_manager', $defaultHotelSettings['channel_manager']);
            $migrator->add('hotel.api_settings', $defaultHotelSettings['api_settings']);
        });
    }
}
