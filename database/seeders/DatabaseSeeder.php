<?php

namespace Database\Seeders;

use App\Models\BookingChannel;
use App\Models\Building;
use App\Models\Citizen;
use App\Models\Floor;
use App\Models\TaxOffice;
use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\LaravelSettings\Migrations\SettingsMigrator;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    protected SettingsMigrator $migrator;

    public function __construct()
    {
        $this->migrator = app(SettingsMigrator::class);
    }

    public function run(): void
    {

        $role = Role::create(['name' => 'Super Admin']);
        $user = User::factory()->create(['name' => 'Admin', 'email' => 'admin@otelyonet.com', 'password' => bcrypt('admin'),]);
        $user->assignRole($role);
    }
}
