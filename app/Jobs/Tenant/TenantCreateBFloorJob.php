<?php

namespace App\Jobs\Tenant;

use App\Models\Building;
use App\Models\Floor;
use App\Models\Tenant;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class TenantCreateBFloorJob implements ShouldQueue, ShouldBeUnique
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
        $this->tenant->run(function () {
            $building = Building::create(['name' => 'Ana Bina', 'description' => 'Otelin Ana Binası']);
            Floor::create(['building_id' => $building->id, 'name' => 'Zemin Kat',]);
        });
    }
}
