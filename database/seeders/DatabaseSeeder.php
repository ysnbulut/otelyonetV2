<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\LaravelSettings\Migrations\SettingsMigrator;

class DatabaseSeeder extends Seeder
{
    protected SettingsMigrator $migrator;

    public function __construct()
    {
        $this->migrator = app(SettingsMigrator::class);
    }

    public function run(): void
    {
      (new UserSeeder())->run();
      (new ProvinceSeeder())->run();
      (new DistrictSeeder())->run();
      (new TaxOfficeSeeder())->run();
    }
}
